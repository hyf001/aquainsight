package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 创建方案请求
 */
@Data
public class CreateSchemeRequest {

    @NotBlank(message = "方案名称不能为空")
    private String name;

    @NotBlank(message = "方案编码不能为空")
    private String code;
}
