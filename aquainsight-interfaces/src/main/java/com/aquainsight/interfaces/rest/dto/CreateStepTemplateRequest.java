package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 创建步骤模版请求
 */
@Data
public class CreateStepTemplateRequest {

    @NotBlank(message = "类别名称不能为空")
    private String name;

    @NotBlank(message = "类别编码不能为空")
    private String code;

    @Valid
    private List<JobParameterDTO> parameters;

    @NotNull(message = "逾期天数不能为空")
    private Integer overdueDays;

    private String description;
}
