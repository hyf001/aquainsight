package com.aquainsight.api.exception;

import lombok.Getter;

/**
 * 业务异常基类
 */
@Getter
public class BaseException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final String code;
    private final String message;

    public BaseException(String code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public BaseException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.message = message;
    }
}
