package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 作业类别视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCategoryVO {

    private Integer id;

    private String name;

    private String code;

    private Integer needPhoto;

    private String photoTypes;

    private Integer overdueDays;

    private String description;

    private String createTime;

    private String updateTime;
}
