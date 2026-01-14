package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.common.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 公共接口控制器
 * 提供文件上传、图片访问等通用功能
 */
@Slf4j
@RestController
@RequestMapping("/api/common")
public class CommonController {

    /**
     * 文件上传根目录，从配置文件读取，默认为当前目录下的uploads
     */
    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    /**
     * 服务器端口，从配置文件读取
     */
    @Value("${server.port:8080}")
    private String serverPort;

    /**
     * 上传图片
     *
     * @param file 图片文件
     * @return 上传结果，包含图片访问的完整URL
     */
    @PostMapping("/upload/image")
    public Response<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 校验文件
            if (file.isEmpty()) {
                return Response.error("上传文件不能为空");
            }

            // 获取原始文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return Response.error("文件名不能为空");
            }

            // 校验文件类型（只允许图片）
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Response.error("只支持上传图片文件");
            }

            // 生成按日期分类的目录结构: uploads/images/2024/12/14/
            LocalDate now = LocalDate.now();
            String dateFolder = now.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String relativePath = "images/" + dateFolder;

            // 创建完整的目录路径
            Path directoryPath = Paths.get(uploadPath, relativePath);
            Files.createDirectories(directoryPath);

            // 获取文件扩展名
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex).toLowerCase();
            }

            // 生成新文件名: UUID + 扩展名（避免中文和特殊字符问题）
            String filename = UUID.randomUUID().toString().replace("-", "") + fileExtension;
            Path filePath = directoryPath.resolve(filename);

            // 保存文件
            file.transferTo(filePath.toFile());

            // 构建完整的访问URL: http://localhost:端口/aquainsight/api/common/image/...
            String fullUrl = "http://localhost:" + serverPort + "/aquainsight/api/common/image/" + relativePath + "/" + filename;

            // 返回结果
            Map<String, String> result = new HashMap<>();
            result.put("url", fullUrl);
            result.put("filename", filename);
            result.put("originalName", originalFilename);
            result.put("size", String.valueOf(file.getSize()));

            log.info("文件上传成功: {} -> {}", originalFilename, fullUrl);
            return Response.success(result);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            return Response.error("文件上传失败: " + e.getMessage());
        } catch (Exception e) {
            log.error("文件上传异常", e);
            return Response.error("文件上传异常: " + e.getMessage());
        }
    }

    /**
     * 访问图片
     * 支持直接在浏览器中打开图片
     *
     * @param filePath 文件路径（从images/开始的相对路径）
     * @return 图片文件
     */
    @GetMapping("/image/**")
    public ResponseEntity<Resource> getImage(@RequestParam(required = false) String download,
                                            HttpServletRequest request) {
        try {
            // 获取请求路径
            String requestPath = request.getRequestURI();

            // 提取文件相对路径（去掉 /aquainsight/api/common/image/ 前缀）
            String prefix = "/aquainsight/api/common/image/";
            String relativePath = requestPath.substring(requestPath.indexOf(prefix) + prefix.length());

            // 构建完整文件路径
            Path filePath = Paths.get(uploadPath, relativePath);
            File file = filePath.toFile();

            // 检查文件是否存在
            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }

            // 检查文件是否在允许的目录下（防止路径穿越攻击）
            Path uploadDir = Paths.get(uploadPath).toRealPath();
            Path realFilePath = filePath.toRealPath();
            if (!realFilePath.startsWith(uploadDir)) {
                log.warn("检测到路径穿越攻击尝试: {}", requestPath);
                return ResponseEntity.badRequest().build();
            }

            // 创建资源
            Resource resource = new FileSystemResource(file);

            // 获取文件类型（优先根据扩展名判断图片类型）
            String contentType = getImageContentType(file.getName());
            if (contentType == null) {
                contentType = Files.probeContentType(filePath);
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // 构建响应头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));

            // 如果有download参数，设置为下载模式
            if (download != null) {
                headers.setContentDispositionFormData("attachment", file.getName());
            }
            // 图片默认不设置 Content-Disposition，让浏览器直接显示

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .body(resource);

        } catch (IOException e) {
            log.error("读取图片文件失败", e);
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            log.error("访问图片异常", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 根据文件名获取图片的 Content-Type
     */
    private String getImageContentType(String filename) {
        if (filename == null) return null;
        String lowerName = filename.toLowerCase();
        if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerName.endsWith(".png")) {
            return "image/png";
        } else if (lowerName.endsWith(".gif")) {
            return "image/gif";
        } else if (lowerName.endsWith(".webp")) {
            return "image/webp";
        } else if (lowerName.endsWith(".bmp")) {
            return "image/bmp";
        } else if (lowerName.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return null;
    }
}
