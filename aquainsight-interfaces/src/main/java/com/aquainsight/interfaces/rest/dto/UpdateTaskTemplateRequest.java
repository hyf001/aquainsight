package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 更新任务模版请求
 */
@Data
public class UpdateTaskTemplateRequest {

    @NotNull(message = "任务模版ID不能为空")
    private Integer id;

    @NotBlank(message = "任务模版名称不能为空")
    private String name;
}
