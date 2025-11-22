package com.aquainsight.interfaces.rest.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.aquainsight.application.service.UserApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.interfaces.rest.dto.LoginRequest;
import com.aquainsight.interfaces.rest.vo.LoginVO;
import com.aquainsight.interfaces.rest.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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
}
