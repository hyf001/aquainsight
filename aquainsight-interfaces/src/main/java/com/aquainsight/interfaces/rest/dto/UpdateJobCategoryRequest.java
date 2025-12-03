package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.Valid;
import java.util.List;

/**
 * 更新作业类别请求
 */
@Data
public class UpdateJobCategoryRequest {

    private String name;

    @Valid
    private List<JobParameterDTO> parameters;

    private Integer overdueDays;

    private String description;
}
