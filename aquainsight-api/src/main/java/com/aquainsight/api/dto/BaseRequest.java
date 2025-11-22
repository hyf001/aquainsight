package com.aquainsight.api.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 基础请求DTO
 */
@Data
public abstract class BaseRequest implements Serializable {
    private static final long serialVersionUID = 1L;
}
