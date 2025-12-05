package com.aquainsight.domain.alert.service;

import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.entity.Metric;
import com.aquainsight.domain.alert.entity.RuleCondition;
import com.aquainsight.domain.alert.repository.AlertRuleRepository;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertRuleType;
import com.aquainsight.domain.alert.types.RuleEvaluationResult;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 告警规则领域服务
 */
@Service
@RequiredArgsConstructor
public class AlertRuleDomainService {

    private final AlertRuleRepository alertRuleRepository;
    private final MetricCollectorRegistry metricCollectorRegistry;

    /**
     * 创建告警规则
     */
    public AlertRule createRule(String ruleName, AlertRuleType ruleType, List<RuleCondition> conditionConfigs,
                                AlertLevel alertLevel, String alertMessage, Integer schemeId,
                                String notifyTypes, String notifyUsers, String notifyDepartments,
                                Integer quietPeriod, String description, String creator) {
        // 验证必填字段
        if (ruleName == null || ruleName.trim().isEmpty()) {
            throw new IllegalArgumentException("规则名称不能为空");
        }
        if (ruleType == null) {
            throw new IllegalArgumentException("规则类型不能为空");
        }
        if (alertLevel == null) {
            throw new IllegalArgumentException("告警级别不能为空");
        }

        // 检查规则名称是否重复
        if (alertRuleRepository.existsByRuleName(ruleName)) {
            throw new IllegalArgumentException("规则名称已存在: " + ruleName);
        }

        AlertRule rule = AlertRule.builder()
                .ruleName(ruleName)
                .ruleType(ruleType)
                .conditionConfigs(conditionConfigs)
                .alertLevel(alertLevel)
                .alertMessage(alertMessage)
                .schemeId(schemeId)
                .notifyTypes(notifyTypes)
                .notifyUsers(notifyUsers)
                .notifyDepartments(notifyDepartments)
                .enabled(1)
                .quietPeriod(quietPeriod != null ? quietPeriod : 0)
                .description(description)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        // 验证条件配置
        if (!rule.validateConditionConfigs()) {
            throw new IllegalArgumentException("告警条件配置无效");
        }

        return alertRuleRepository.save(rule);
    }

    /**
     * 更新告警规则
     */
    public AlertRule updateRule(Integer ruleId, String ruleName, AlertRuleType ruleType,
                                List<RuleCondition> conditionConfigs, AlertLevel alertLevel,
                                String alertMessage, Integer schemeId, String notifyTypes,
                                String notifyUsers, String notifyDepartments, Integer quietPeriod,
                                String description, String updater) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        // 如果修改了规则名称，检查新名称是否重复
        if (ruleName != null && !ruleName.equals(rule.getRuleName())) {
            if (alertRuleRepository.existsByRuleName(ruleName)) {
                throw new IllegalArgumentException("规则名称已存在: " + ruleName);
            }
        }

        rule.updateInfo(ruleName, ruleType, conditionConfigs, alertLevel, alertMessage,
                schemeId, notifyTypes, notifyUsers, notifyDepartments, quietPeriod,
                description, updater);

        // 验证条件配置
        if (!rule.validateConditionConfigs()) {
            throw new IllegalArgumentException("告警条件配置无效");
        }

        return alertRuleRepository.update(rule);
    }

    /**
     * 启用规则
     */
    public AlertRule enableRule(Integer ruleId) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        if (rule.isEnabled()) {
            throw new IllegalStateException("规则已经是启用状态");
        }

        rule.enable();
        return alertRuleRepository.update(rule);
    }

    /**
     * 禁用规则
     */
    public AlertRule disableRule(Integer ruleId) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        if (rule.isDisabled()) {
            throw new IllegalStateException("规则已经是禁用状态");
        }

        rule.disable();
        return alertRuleRepository.update(rule);
    }

    /**
     * 删除告警规则
     */
    public void deleteRule(Integer ruleId) {
        alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        alertRuleRepository.deleteById(ruleId);
    }

    /**
     * 根据ID获取告警规则
     */
    public AlertRule getRuleById(Integer ruleId) {
        return alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));
    }

    /**
     * 获取所有告警规则
     */
    public List<AlertRule> getAllRules() {
        return alertRuleRepository.findAll();
    }

    /**
     * 获取所有启用的告警规则
     */
    public List<AlertRule> getAllEnabledRules() {
        return alertRuleRepository.findAllEnabled();
    }

    /**
     * 根据规则类型获取启用的告警规则
     */
    public List<AlertRule> getEnabledRulesByType(AlertRuleType ruleType) {
        return alertRuleRepository.findEnabledByRuleType(ruleType);
    }

    /**
     * 根据方案ID获取关联的告警规则
     */
    public List<AlertRule> getRulesBySchemeId(Integer schemeId) {
        return alertRuleRepository.findBySchemeId(schemeId);
    }

    /**
     * 添加条件配置到规则
     */
    public AlertRule addConditionConfig(Integer ruleId, RuleCondition config) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        if (config == null || !config.isValid()) {
            throw new IllegalArgumentException("条件配置无效");
        }

        rule.addConditionConfig(config);
        return alertRuleRepository.update(rule);
    }

    /**
     * 移除规则的条件配置
     */
    public AlertRule removeConditionConfig(Integer ruleId, RuleCondition config) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        rule.removeConditionConfig(config);
        return alertRuleRepository.update(rule);
    }

    /**
     * 验证规则配置是否合法
     */
    public boolean validateRuleConfig(AlertRule rule) {
        return rule != null && rule.validateConditionConfigs();
    }

    /**
     * 检查规则是否在静默期内
     */
    public boolean isInQuietPeriod(AlertRule rule, LocalDateTime lastAlertTime) {
        if (!rule.hasQuietPeriod() || lastAlertTime == null) {
            return false;
        }

        LocalDateTime quietPeriodEnd = lastAlertTime.plusMinutes(rule.getQuietPeriod());
        return LocalDateTime.now().isBefore(quietPeriodEnd);
    }

    /**
     * 评估单个条件，返回满足条件的指标列表
     *
     * @param condition 规则条件配置
     * @param metrics 采集到的指标值列表
     * @return 满足条件的指标列表
     */
    public List<Metric> evaluateCondition(RuleCondition condition, List<Metric> metrics) {
        List<Metric> triggeredMetrics = new ArrayList<>();

        if (condition == null || !condition.isValid() || metrics == null || metrics.isEmpty()) {
            return triggeredMetrics;
        }

        // 遍历所有采集到的指标值，找出所有满足条件的指标
        for (Metric metric : metrics) {
            if (metric.getValue() == null) {
                continue;
            }

            if (checkMetricValue(condition, metric.getValue())) {
                triggeredMetrics.add(metric);
            }
        }

        return triggeredMetrics;
    }

    /**
     * 检查指标值是否满足条件
     *
     * @param condition 规则条件
     * @param value 指标值
     * @return 是否满足条件
     */
    private boolean checkMetricValue(RuleCondition condition, BigDecimal value) {
        RuleCondition.ComparisonOperator operator = condition.getOperator();

        switch (operator) {
            case GT:
                return value.compareTo(condition.getThreshold()) > 0;
            case GTE:
                return value.compareTo(condition.getThreshold()) >= 0;
            case LT:
                return value.compareTo(condition.getThreshold()) < 0;
            case LTE:
                return value.compareTo(condition.getThreshold()) <= 0;
            case EQ:
                return value.compareTo(condition.getThreshold()) == 0;
            case NEQ:
                return value.compareTo(condition.getThreshold()) != 0;
            case BETWEEN:
                return value.compareTo(condition.getMinThreshold()) >= 0
                    && value.compareTo(condition.getMaxThreshold()) <= 0;
            case NOT_BETWEEN:
                return value.compareTo(condition.getMinThreshold()) < 0
                    || value.compareTo(condition.getMaxThreshold()) > 0;
            default:
                return false;
        }
    }

    /**
     * 评估告警规则的所有条件是否满足
     * 所有条件都满足时才触发告警（AND逻辑）
     *
     * @param ruleId 告警规则ID
     * @param targetType 目标对象类型(如: site, device等)
     * @param targetId 目标对象ID
     * @return 规则评估结果，包含是否触发告警和触发的指标列表
     */
    public RuleEvaluationResult evaluateRule(Integer ruleId, String targetType, Integer targetId) {
        // 获取告警规则
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("告警规则不存在"));

        RuleEvaluationResult result = RuleEvaluationResult.builder()
                .ruleId(rule.getId())
                .ruleName(rule.getRuleName())
                .triggered(false)
                .triggeredMetrics(new ArrayList<>())
                .evaluationTime(LocalDateTime.now())
                .build();

        // 检查规则是否启用
        if (!rule.isEnabled() || !rule.hasConditionConfigs()) {
            return result;
        }

        List<RuleCondition> conditions = rule.getConditionConfigs();
        List<Metric> allTriggeredMetrics = new ArrayList<>();
        boolean allConditionsMet = true;

        // 所有条件都必须满足（AND逻辑）
        for (RuleCondition condition : conditions) {
            // 根据指标名称获取对应的采集器
            MetricCollector collector = metricCollectorRegistry.getCollector(condition.getMetric());

            // 采集指标数据 - 针对特定目标对象
            List<Metric> metrics = collector.collect(condition.getMetric(), targetType, targetId);

            // 评估条件，获取满足条件的指标
            List<Metric> triggeredMetrics = evaluateCondition(condition, metrics);

            // 如果该条件没有满足的指标，则整体不触发告警
            if (triggeredMetrics.isEmpty()) {
                allConditionsMet = false;
                break;
            }

            // 收集所有触发的指标
            allTriggeredMetrics.addAll(triggeredMetrics);
        }

        // 只有所有条件都满足时才触发告警
        if (allConditionsMet) {
            result.setTriggered(true);
            result.setTriggeredMetrics(allTriggeredMetrics);
        }

        return result;
    }
}
