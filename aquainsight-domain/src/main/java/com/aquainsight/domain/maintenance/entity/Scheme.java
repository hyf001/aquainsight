package com.aquainsight.domain.maintenance.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 维护方案实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {

    /**
     * 方案ID
     */
    private Integer id;

    /**
     * 方案名称
     */
    private String name;

    /**
     * 方案编码
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
     * 方案项目列表
     */
    private List<SchemeItem> items = new ArrayList<>();

    /**
     * 更新方案信息
     */
    public void updateInfo(String name, String updater) {
        if (name != null) {
            this.name = name;
        }
        this.updater = updater;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 添加方案项目
     */
    public void addItem(SchemeItem item) {
        if (this.items == null) {
            this.items = new ArrayList<>();
        }
        this.items.add(item);
    }

    /**
     * 移除方案项目
     */
    public void removeItem(SchemeItem item) {
        if (this.items != null) {
            this.items.remove(item);
        }
    }

    /**
     * 获取方案项目数量
     */
    public int getItemCount() {
        return this.items != null ? this.items.size() : 0;
    }
}
