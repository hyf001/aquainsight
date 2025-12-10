package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.StepParameter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 步骤模版
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StepTemplate {

    /**
     * 步骤定义ID
     */
    private Integer id;

    /**
     * 步骤名称
     */
    private String name;

    /**
     * 步骤编码
     */
    private String code;

    /**
     * 参数列表
     */
    private List<StepParameter> parameters;

    /**
     * 逾期天数
     */
    private Integer overdueDays;

    /**
     * 类别描述
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
     * 更新信息
     */
    public void updateInfo(String name, List<StepParameter> parameters,
                          Integer overdueDays, String description) {
        if (name != null) {
            this.name = name;
        }
        if (parameters != null) {
            this.parameters = parameters;
        }
        if (overdueDays != null) {
            this.overdueDays = overdueDays;
        }
        if (description != null) {
            this.description = description;
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 是否逾期
     */
    public boolean isOverdue(LocalDateTime lastMaintenanceTime) {
        if (lastMaintenanceTime == null || overdueDays == null || overdueDays == 0) {
            return false;
        }
        return LocalDateTime.now().isAfter(lastMaintenanceTime.plusDays(overdueDays));
    }
}
