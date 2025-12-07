package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 手动创建任务实例请求
 */
@Data
public class CreateManualJobInstanceRequest {

    @NotNull(message = "站点ID不能为空")
    private Integer siteId;

    @NotNull(message = "方案ID不能为空")
    private Integer schemeId;

    @NotNull(message = "部门ID不能为空")
    private Integer departmentId;
}
