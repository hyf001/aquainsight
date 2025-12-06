package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 告警规则持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("alert_rule")
public class AlertRulePO {

    /**
     * 规则ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 告警对象类型(site-站点, device-设备, task-任务)
     */
    private String alertTargetType;

    /**
     * 条件配置(JSON格式)
     */
    private String conditionConfigs;

    /**
     * 告警级别(1-紧急, 2-重要, 3-一般, 4-提示)
     */
    private Integer alertLevel;

    /**
     * 告警消息模板
     */
    private String alertMessage;

    /**
     * 关联方案ID(用于创建处理任务实例)
     */
    private Integer schemeId;

    /**
     * 通知方式(多个用逗号分隔: SMS,EMAIL,WECHAT)
     */
    private String notifyTypes;

    /**
     * 通知用户列表(多个用户名用逗号分隔)
     */
    private String notifyUsers;

    /**
     * 通知部门列表(多个部门ID用逗号分隔)
     */
    private String notifyDepartments;

    /**
     * 是否启用(0-禁用,1-启用)
     */
    private Integer enabled;

    /**
     * 静默期(分钟)
     */
    private Integer quietPeriod;

    /**
     * 规则描述
     */
    private String description;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 更新人
     */
    private String updater;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    @TableLogic
    private Integer deleted;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
