package com.aquainsight.interfaces.interceptor;

import cn.dev33.satoken.stp.StpUtil;
import com.alibaba.fastjson2.JSON;
import com.aquainsight.application.service.UserApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.common.util.ThreadLocalUtil;
import com.aquainsight.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

/**
 * 登录拦截器
 * 从请求头中获取X-TOKEN并通过sa-token解析用户信息，存储到ThreadLocal中
 * 如果token无效或不存在，返回401状态码
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LoginInterceptor implements HandlerInterceptor {

    private static final String TOKEN_HEADER = "X-TOKEN";

    private final UserApplicationService userApplicationService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 从请求头获取token
        String token = request.getHeader(TOKEN_HEADER);

        // 如果没有token，返回401
        if (token == null || token.isEmpty()) {
            sendUnauthorized(response, "未提供认证token，请先登录");
            return false;
        }

        try {
            // 使用sa-token解析token获取用户ID
            Object loginId = StpUtil.getLoginIdByToken(token);

            if (loginId == null) {
                sendUnauthorized(response, "Token无效或已过期，请重新登录");
                return false;
            }

            // 转换为Integer类型的用户ID
            Integer userId = Integer.valueOf(loginId.toString());

            // 通过UserApplicationService加载用户信息
            Optional<User> userOptional = userApplicationService.getUserById(userId);
            if (!userOptional.isPresent()) {
                sendUnauthorized(response, "用户不存在，请重新登录");
                return false;
            }

            User user = userOptional.get();

            // 检查用户状态
            if (user.getStatus() == null || user.getStatus() != 1) {
                sendUnauthorized(response, "用户已被禁用，请联系管理员");
                return false;
            }

            // 将完整的用户对象存入ThreadLocal
            ThreadLocalUtil.setUser(user);
            return true;

        } catch (Exception e) {
            log.warn("解析token失败: {}", e.getMessage());
            sendUnauthorized(response, "Token解析失败，请重新登录");
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 请求完成后清除ThreadLocal，避免内存泄漏
        ThreadLocalUtil.clear();
    }

    /**
     * 返回401未授权响应
     */
    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(JSON.toJSONString(Response.error("401", message)));
    }
}
