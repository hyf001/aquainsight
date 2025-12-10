package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 更新任务模版项目请求
 */
@Data
public class UpdateTaskTemplateItemRequest {

    @NotNull(message = "任务模版项目ID不能为空")
    private Integer id;

    @NotBlank(message = "项目名称不能为空")
    private String itemName;

    private String description;
}
