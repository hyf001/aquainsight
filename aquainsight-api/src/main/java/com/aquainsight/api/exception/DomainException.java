package com.aquainsight.api.exception;

/**
 * 领域层异常
 */
public class DomainException extends BaseException {
    private static final long serialVersionUID = 1L;

    public DomainException(String code, String message) {
        super(code, message);
    }

    public DomainException(String code, String message, Throwable cause) {
        super(code, message, cause);
    }
}
