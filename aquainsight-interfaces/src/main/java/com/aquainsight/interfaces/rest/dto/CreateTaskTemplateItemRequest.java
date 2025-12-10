package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 创建任务模版项目请求
 */
@Data
public class CreateTaskTemplateItemRequest {

    @NotNull(message = "任务模版ID不能为空")
    private Integer taskTemplateId;

    @NotNull(message = "步骤模版ID不能为空")
    private Integer stepTemplateId;

    @NotBlank(message = "项目名称不能为空")
    private String itemName;

    private String description;
}
