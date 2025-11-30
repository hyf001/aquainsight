package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

/**
 * 更新作业类别请求
 */
@Data
public class UpdateJobCategoryRequest {

    private String name;

    private Integer needPhoto;

    private String photoTypes;

    private Integer overdueDays;

    private String description;
}
