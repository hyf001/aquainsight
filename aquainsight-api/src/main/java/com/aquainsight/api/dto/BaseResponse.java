package com.aquainsight.api.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 基础响应DTO
 */
@Data
public abstract class BaseResponse implements Serializable {
    private static final long serialVersionUID = 1L;
}
