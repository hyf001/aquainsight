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

/**
 * 公共接口控制器
 * 提供文件上传、图片访问等通用功能
 */
@Slf4j
@RestController
@RequestMapping("/common")
public class CommonController {

    /**
     * 文件上传根目录，从配置文件读取，默认为当前目录下的uploads
     */
    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    /**
     * 上传图片
     *
     * @param file 图片文件
     * @return 上传结果，包含图片访问路径
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
                fileExtension = originalFilename.substring(dotIndex);
            }

            // 获取不带扩展名的原始文件名
            String baseFilename = dotIndex > 0 ? originalFilename.substring(0, dotIndex) : originalFilename;

            // 生成新文件名: 原始文件名 + 绝对毫秒值 + 扩展名
            String filename = baseFilename + "_" + System.currentTimeMillis() + fileExtension;
            Path filePath = directoryPath.resolve(filename);

            // 保存文件
            file.transferTo(filePath.toFile());

            // 构建访问URL路径
            String accessPath = "/common/image/" + relativePath + "/" + filename;

            // 返回结果
            Map<String, String> result = new HashMap<>();
            result.put("url", accessPath);
            result.put("filename", filename);
            result.put("originalName", originalFilename);
            result.put("size", String.valueOf(file.getSize()));

            log.info("文件上传成功: {} -> {}", originalFilename, accessPath);
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

            // 提取文件相对路径（去掉 /common/image/ 前缀）
            String relativePath = requestPath.substring("/common/image/".length());

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

            // 获取文件类型
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // 构建响应头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));

            // 如果有download参数，设置为下载模式
            if (download != null) {
                headers.setContentDispositionFormData("attachment", file.getName());
            } else {
                // 否则设置为inline模式，可以在浏览器中直接查看
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"");
            }

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
}
