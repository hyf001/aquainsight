package com.aquainsight.domain.maintenance.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 步骤项
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskTemplateItem {

    /**
     * 步骤项ID
     */
    private Integer id;

    /**
     * 所属任务模版ID
     */
    private Integer taskTemplateId;

    /**
     * 项目名称
     */
    private String itemName;

    /**
     * 步骤模版ID
     */
    private Integer stepTemplateId;

    /**
     * 步骤模版（关联查询时填充）
     */
    private StepTemplate stepTemplate;

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
     * 更新任务模版项目信息
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
