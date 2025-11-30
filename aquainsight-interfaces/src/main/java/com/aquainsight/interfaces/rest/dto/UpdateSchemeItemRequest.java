package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 更新方案项目请求
 */
@Data
public class UpdateSchemeItemRequest {

    @NotNull(message = "方案项目ID不能为空")
    private Integer id;

    @NotBlank(message = "项目名称不能为空")
    private String itemName;

    private String description;
}
