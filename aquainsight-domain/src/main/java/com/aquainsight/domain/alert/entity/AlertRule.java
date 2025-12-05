package com.aquainsight.domain.alert.entity;

import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertRuleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 告警规则实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRule {

    /**
     * 告警规则ID
     */
    private Integer id;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 规则类型
     */
    private AlertRuleType ruleType;

    /**
     * 告警条件配置列表
     * 支持多个条件组合（如多个因子同时超标才触发）
     */
    private List<RuleCondition> conditionConfigs;

    /**
     * 告警级别
     */
    private AlertLevel alertLevel;

    /**
     * 告警消息模板
     */
    private String alertMessage;

    /**
     * 关联方案ID(用于创建处理任务实例)
     */
    private Integer schemeId;

    /**
     * 通知方式(多个逗号分隔: sms,email,push,wechat)
     */
    private String notifyTypes;

    /**
     * 通知人员ID列表(多个逗号分隔)
     */
    private String notifyUsers;

    /**
     * 通知部门ID列表(多个逗号分隔)
     */
    private String notifyDepartments;

    /**
     * 是否启用(0-禁用,1-启用)
     */
    private Integer enabled;

    /**
     * 静默期(分钟),同一规则在静默期内不重复告警
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
     * 更新规则信息
     */
    public void updateInfo(String ruleName, AlertRuleType ruleType, List<RuleCondition> conditionConfigs,
                          AlertLevel alertLevel, String alertMessage, Integer schemeId,
                          String notifyTypes, String notifyUsers, String notifyDepartments,
                          Integer quietPeriod, String description, String updater) {
        if (ruleName != null) {
            this.ruleName = ruleName;
        }
        if (ruleType != null) {
            this.ruleType = ruleType;
        }
        if (conditionConfigs != null) {
            this.conditionConfigs = conditionConfigs;
        }
        if (alertLevel != null) {
            this.alertLevel = alertLevel;
        }
        if (alertMessage != null) {
            this.alertMessage = alertMessage;
        }
        if (schemeId != null) {
            this.schemeId = schemeId;
        }
        if (notifyTypes != null) {
            this.notifyTypes = notifyTypes;
        }
        if (notifyUsers != null) {
            this.notifyUsers = notifyUsers;
        }
        if (notifyDepartments != null) {
            this.notifyDepartments = notifyDepartments;
        }
        if (quietPeriod != null) {
            this.quietPeriod = quietPeriod;
        }
        if (description != null) {
            this.description = description;
        }
        this.updater = updater;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 启用规则
     */
    public void enable() {
        this.enabled = 1;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 禁用规则
     */
    public void disable() {
        this.enabled = 0;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 是否启用
     */
    public boolean isEnabled() {
        return Integer.valueOf(1).equals(this.enabled);
    }

    /**
     * 是否禁用
     */
    public boolean isDisabled() {
        return Integer.valueOf(0).equals(this.enabled);
    }

    /**
     * 获取通知方式列表
     */
    public List<String> getNotifyTypeList() {
        if (this.notifyTypes == null || this.notifyTypes.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(this.notifyTypes.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * 获取通知人员ID列表
     */
    public List<Integer> getNotifyUserIdList() {
        if (this.notifyUsers == null || this.notifyUsers.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(this.notifyUsers.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }

    /**
     * 获取通知部门ID列表
     */
    public List<Integer> getNotifyDepartmentIdList() {
        if (this.notifyDepartments == null || this.notifyDepartments.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(this.notifyDepartments.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }

    /**
     * 是否有静默期
     */
    public boolean hasQuietPeriod() {
        return this.quietPeriod != null && this.quietPeriod > 0;
    }

    /**
     * 是否关联处理方案
     */
    public boolean hasScheme() {
        return this.schemeId != null && this.schemeId > 0;
    }

    /**
     * 是否为紧急告警
     */
    public boolean isUrgent() {
        return AlertLevel.URGENT.equals(this.alertLevel);
    }

    /**
     * 是否为重要告警
     */
    public boolean isImportant() {
        return AlertLevel.IMPORTANT.equals(this.alertLevel);
    }

    /**
     * 添加条件配置
     */
    public void addConditionConfig(RuleCondition config) {
        if (this.conditionConfigs == null) {
            this.conditionConfigs = new ArrayList<>();
        }
        this.conditionConfigs.add(config);
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 移除条件配置
     */
    public void removeConditionConfig(RuleCondition config) {
        if (this.conditionConfigs != null) {
            this.conditionConfigs.remove(config);
            this.updateTime = LocalDateTime.now();
        }
    }

    /**
     * 清空所有条件配置
     */
    public void clearConditionConfigs() {
        if (this.conditionConfigs != null) {
            this.conditionConfigs.clear();
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 获取条件配置数量
     */
    public int getConditionConfigCount() {
        return this.conditionConfigs != null ? this.conditionConfigs.size() : 0;
    }

    /**
     * 是否有条件配置
     */
    public boolean hasConditionConfigs() {
        return this.conditionConfigs != null && !this.conditionConfigs.isEmpty();
    }

    /**
     * 获取所有配置的指标名称列表
     */
    public List<String> getMetricNames() {
        if (this.conditionConfigs == null || this.conditionConfigs.isEmpty()) {
            return new ArrayList<>();
        }
        return this.conditionConfigs.stream()
                .map(RuleCondition::getMetric)
                .filter(metric -> metric != null && !metric.trim().isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * 验证条件配置是否有效
     */
    public boolean validateConditionConfigs() {
        // 如果规则类型需要配置条件，则必须有有效的条件配置
        if (this.ruleType != null && this.ruleType.needConditionConfig()) {
            if (this.conditionConfigs == null || this.conditionConfigs.isEmpty()) {
                return false;
            }
            // 所有条件配置都必须有效
            return this.conditionConfigs.stream().allMatch(RuleCondition::isValid);
        }
        // 不需要配置条件的规则类型，返回true
        return true;
    }

}
