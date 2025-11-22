package com.aquainsight.api.exception;

/**
 * 基础设施层异常
 */
public class InfrastructureException extends BaseException {
    private static final long serialVersionUID = 1L;

    public InfrastructureException(String code, String message) {
        super(code, message);
    }

    public InfrastructureException(String code, String message, Throwable cause) {
        super(code, message, cause);
    }
}
