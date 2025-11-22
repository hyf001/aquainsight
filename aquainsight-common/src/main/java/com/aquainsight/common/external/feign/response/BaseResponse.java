package com.aquainsight.common.external.feign.response;

import lombok.Data;

import java.io.Serializable;

/**
 * 外部服务响应基类
 */
@Data
public abstract class BaseResponse implements Serializable {
    private static final long serialVersionUID = 1L;
}
