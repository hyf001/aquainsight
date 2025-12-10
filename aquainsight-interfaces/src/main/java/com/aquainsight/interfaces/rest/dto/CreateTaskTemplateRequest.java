package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 创建任务模版请求
 */
@Data
public class CreateTaskTemplateRequest {

    @NotBlank(message = "任务模版名称不能为空")
    private String name;

    @NotBlank(message = "任务模版编码不能为空")
    private String code;
}
