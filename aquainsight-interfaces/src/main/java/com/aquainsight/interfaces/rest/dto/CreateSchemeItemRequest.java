package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 创建方案项目请求
 */
@Data
public class CreateSchemeItemRequest {

    @NotNull(message = "方案ID不能为空")
    private Integer schemeId;

    @NotNull(message = "作业类别ID不能为空")
    private Integer jobCategoryId;

    @NotBlank(message = "项目名称不能为空")
    private String itemName;

    private String description;
}
