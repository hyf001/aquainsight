package com.aquainsight.domain.maintenance.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 方案项目实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeItem {

    /**
     * 方案项目ID
     */
    private Integer id;

    /**
     * 所属方案ID
     */
    private Integer schemeId;

    /**
     * 项目名称
     */
    private String itemName;

    /**
     * 作业类别ID
     */
    private Integer jobCategoryId;

    /**
     * 作业类别（关联查询时填充）
     */
    private JobCategory jobCategory;

    /**
     * 说明
     */
    private String description;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 更新方案项目信息
     */
    public void updateInfo(String itemName, String description) {
        if (itemName != null) {
            this.itemName = itemName;
        }
        if (description != null) {
            this.description = description;
        }
        this.updateTime = LocalDateTime.now();
    }
}
