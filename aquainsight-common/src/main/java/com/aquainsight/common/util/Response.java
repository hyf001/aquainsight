package com.aquainsight.common.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 统一响应封装
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private String code;
    private String message;
    private T data;

    public static <T> Response<T> success() {
        return new Response<>("0000", "success", null);
    }

    public static <T> Response<T> success(T data) {
        return new Response<>("0000", "success", data);
    }

    public static <T> Response<T> success(String message, T data) {
        return new Response<>("0000", message, data);
    }

    public static <T> Response<T> error(String code, String message) {
        return new Response<>(code, message, null);
    }

    public static <T> Response<T> error(String message) {
        return new Response<>("9999", message, null);
    }
}
