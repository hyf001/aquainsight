package com.aquainsight.common.config;

import com.aquainsight.api.exception.BaseException;
import com.aquainsight.common.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public Response<?> handleBaseException(BaseException e) {
        log.error("业务异常: code={}, message={}", e.getCode(), e.getMessage(), e);
        return Response.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Response<?> handleException(Exception e) {
        log.error("系统异常", e);
        return Response.error("系统异常，请稍后重试");
    }
}
