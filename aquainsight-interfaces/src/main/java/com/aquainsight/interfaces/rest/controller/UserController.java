package com.aquainsight.interfaces.rest.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.aquainsight.application.service.UserApplicationService;
import com.aquainsight.common.util.PageResult;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.interfaces.rest.dto.CreateUserRequest;
import com.aquainsight.interfaces.rest.dto.LoginRequest;
import com.aquainsight.interfaces.rest.dto.SetRoleRequest;
import com.aquainsight.interfaces.rest.dto.UpdateUserRequest;
import com.aquainsight.interfaces.rest.vo.LoginVO;
import com.aquainsight.interfaces.rest.vo.UserInfoVO;
import com.aquainsight.interfaces.rest.vo.UserVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 用户控制器
 *
 * @author aquainsight
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserApplicationService userApplicationService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 用户登录
     *
     * @param request 登录请求
     * @return 登录响应
     */
    @PostMapping("/login")
    public Response<LoginVO> login(@Valid @RequestBody LoginRequest request) {
        try {
            // 调用应用服务进行登录验证
            User user = userApplicationService.login(request.getPhone(), request.getPassword());

            // 执行Sa-Token登录
            StpUtil.login(user.getId());

            // 获取token
            String token = StpUtil.getTokenValue();

            // 构造用户信息VO
            UserVO userVO = UserVO.builder()
                    .id(String.valueOf(user.getId()))
                    .name(user.getName())
                    .avatar(user.getAvatar())
                    .role(user.getRole())
                    .build();

            // 构造登录响应
            LoginVO loginVO = LoginVO.builder()
                    .token(token)
                    .user(userVO)
                    .build();

            return Response.success(loginVO);
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 用户登出
     *
     * @return 响应结果
     */
    @PostMapping("/logout")
    public Response<Void> logout() {
        StpUtil.logout();
        return Response.success();
    }

    /**
     * 获取当前用户信息
     *
     * @return 用户信息
     */
    @GetMapping("/info")
    public Response<UserVO> getUserInfo() {
        // 获取当前登录用户ID
        String userIdStr = StpUtil.getLoginIdAsString();
        Integer userId = Integer.parseInt(userIdStr);

        // 从数据库查询用户信息
        return userApplicationService.getUserById(userId)
                .map(user -> {
                    UserVO userVO = UserVO.builder()
                            .id(String.valueOf(user.getId()))
                            .name(user.getName())
                            .avatar(user.getAvatar())
                            .role(user.getRole())
                            .build();
                    return Response.success(userVO);
                })
                .orElse(Response.error("用户不存在"));
    }

    // ==================== 人员管理接口 ====================

    /**
     * 获取人员列表（分页）
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页人员列表
     */
    @GetMapping("/list")
    public Response<PageResult<UserInfoVO>> getUserList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        IPage<User> page = userApplicationService.getUserPage(pageNum, pageSize);

        List<UserInfoVO> voList = page.getRecords().stream()
                .map(this::convertToUserInfoVO)
                .collect(Collectors.toList());

        PageResult<UserInfoVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
        return Response.success(result);
    }

    /**
     * 创建人员
     *
     * @param request 创建请求
     * @return 新用户
     */
    @PostMapping
    public Response<UserInfoVO> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User user = userApplicationService.register(
                    request.getPassword(),
                    request.getName(),
                    request.getPhone(),
                    request.getEmail(),
                    request.getRole() != null ? request.getRole() : "user"
            );

            // 如果指定了性别，更新性别
            if (request.getGender() != null) {
                user.setGender(request.getGender());
                user = userApplicationService.updateUserInfo(user.getId(), user.getName(), user.getPhone(), user.getEmail(), user.getAvatar());
            }

            return Response.success(convertToUserInfoVO(user));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新人员信息
     *
     * @param id      用户ID
     * @param request 更新请求
     * @return 更新后的用户
     */
    @PutMapping("/{id}")
    public Response<UserInfoVO> updateUser(@PathVariable Integer id, @RequestBody UpdateUserRequest request) {
        try {
            Optional<User> userOpt = userApplicationService.getUserById(id);
            if (!userOpt.isPresent()) {
                return Response.error("用户不存在");
            }

            User user = userOpt.get();

            // 准备更新的数据
            String name = request.getName() != null ? request.getName() : user.getName();
            String phone = request.getPhone() != null ? request.getPhone() : user.getPhone();
            String email = request.getEmail() != null ? request.getEmail() : user.getEmail();
            String avatar = request.getAvatar() != null ? request.getAvatar() : user.getAvatar();

            // 更新性别（如果提供）
            if (request.getGender() != null) {
                user.setGender(request.getGender());
            }

            user = userApplicationService.updateUserInfo(id, name, phone, email, avatar);

            return Response.success(convertToUserInfoVO(user));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除人员
     *
     * @param id 用户ID
     * @return 是否删除成功
     */
    @DeleteMapping("/{id}")
    public Response<Void> deleteUser(@PathVariable Integer id) {
        try {
            boolean success = userApplicationService.deleteUser(id);
            if (success) {
                return Response.success();
            } else {
                return Response.error("删除失败");
            }
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 设置角色
     *
     * @param id      用户ID
     * @param request 设置角色请求
     * @return 更新后的用户
     */
    @PutMapping("/{id}/role")
    public Response<UserInfoVO> setUserRole(@PathVariable Integer id, @Valid @RequestBody SetRoleRequest request) {
        try {
            User user = userApplicationService.setUserRole(id, request.getRole());
            return Response.success(convertToUserInfoVO(user));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 重置密码
     *
     * @param id 用户ID
     * @return 是否重置成功
     */
    @PutMapping("/{id}/reset-password")
    public Response<Void> resetPassword(@PathVariable Integer id) {
        try {
            userApplicationService.resetPassword(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 上传头像
     *
     * @param id 用户ID
     * @return 头像URL
     */
    @PostMapping("/{id}/avatar")
    public Response<Map<String, String>> uploadAvatar(@PathVariable Integer id) {
        // TODO: 实现文件上传逻辑
        // 暂时返回模拟数据
        Map<String, String> result = new HashMap<>();
        result.put("url", "/avatar/default.png");
        return Response.success(result);
    }

    private UserInfoVO convertToUserInfoVO(User user) {
        return UserInfoVO.builder()
                .id(user.getId())
                .name(user.getName())
                .gender(user.getGender())
                .phone(user.getPhone())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .status(user.getStatus())
                .createTime(user.getCreateTime() != null ? user.getCreateTime().format(DATE_FORMATTER) : null)
                .build();
    }
}
