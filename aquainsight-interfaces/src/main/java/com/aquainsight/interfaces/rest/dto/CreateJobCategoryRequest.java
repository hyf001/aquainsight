package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 创建作业类别请求
 */
@Data
public class CreateJobCategoryRequest {

    @NotBlank(message = "类别名称不能为空")
    private String name;

    @NotBlank(message = "类别编码不能为空")
    private String code;

    @NotNull(message = "是否需要拍照不能为空")
    private Integer needPhoto;

    private String photoTypes;

    @NotNull(message = "逾期天数不能为空")
    private Integer overdueDays;

    private String description;
}
