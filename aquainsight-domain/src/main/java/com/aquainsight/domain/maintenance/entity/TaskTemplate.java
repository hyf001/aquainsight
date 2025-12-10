package com.aquainsight.domain.maintenance.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 维护任务模版实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskTemplate {

    /**
     * 任务模版ID
     */
    private Integer id;

    /**
     * 任务模版名称
     */
    private String name;

    /**
     * 任务模版编码
     */
    private String code;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新人
     */
    private String updater;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 步骤项目列表
     */
    private List<TaskTemplateItem> items = new ArrayList<>();

    /**
     * 更新任务模版信息
     */
    public void updateInfo(String name, String updater) {
        if (name != null) {
            this.name = name;
        }
        this.updater = updater;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 添加步骤项目
     */
    public void addItem(TaskTemplateItem item) {
        if (this.items == null) {
            this.items = new ArrayList<>();
        }
        this.items.add(item);
    }

    /**
     * 移除步骤项目
     */
    public void removeItem(TaskTemplateItem item) {
        if (this.items != null) {
            this.items.remove(item);
        }
    }

    /**
     * 获取步骤项目数量
     */
    public int getItemCount() {
        return this.items != null ? this.items.size() : 0;
    }
}
