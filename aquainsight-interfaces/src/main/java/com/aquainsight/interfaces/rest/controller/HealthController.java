package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.common.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 *
 * @author aquainsight
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    /**
     * 存活检查接口
     *
     * @return 响应结果
     */
    @GetMapping("/alive")
    public Response<Map<String, Object>> alive() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("timestamp", LocalDateTime.now());
        data.put("application", "aquainsight");
        return Response.success(data);
    }
}
