package com.aquainsight.common.external.feign.request;

import lombok.Data;

import java.io.Serializable;

/**
 * 外部服务请求基类
 */
@Data
public abstract class BaseRequest implements Serializable {
    private static final long serialVersionUID = 1L;
}
