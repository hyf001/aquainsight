package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 手动创建任务请求
 */
@Data
public class CreateManualJobInstanceRequest {

    @NotNull(message = "站点ID不能为空")
    private Integer siteId;

    @NotNull(message = "任务模版ID不能为空")
    private Integer taskTemplateId;

    @NotNull(message = "部门ID不能为空")
    private Integer departmentId;
}
