package com.aquainsight.api.exception;

/**
 * API层异常
 */
public class ApiException extends BaseException {
    private static final long serialVersionUID = 1L;

    public ApiException(String code, String message) {
        super(code, message);
    }

    public ApiException(String code, String message, Throwable cause) {
        super(code, message, cause);
    }
}
