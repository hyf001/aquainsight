package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 方案项目视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeItemVO {

    private Integer id;

    private Integer schemeId;

    private Integer jobCategoryId;

    private JobCategoryVO jobCategory;

    private String itemName;

    private String description;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
