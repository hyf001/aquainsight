package com.aquainsight.application.service;

import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.entity.Metric;
import com.aquainsight.domain.alert.repository.AlertRecordRepository;
import com.aquainsight.domain.alert.repository.AlertRuleRepository;
import com.aquainsight.domain.alert.service.AlertRuleDomainService;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.RuleEvaluationResult;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import com.aquainsight.domain.monitoring.repository.DeviceRepository;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 告警应用服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AlertApplicationService {

    private final AlertRuleDomainService alertRuleDomainService;
    private final AlertRuleRepository alertRuleRepository;
    private final AlertRecordRepository alertRecordRepository;
    private final SiteRepository siteRepository;
    private final DeviceRepository deviceRepository;
    private final SiteJobInstanceRepository siteJobInstanceRepository;

    /**
     * 扫描并评估所有启用的告警规则
     * 对符合条件的目标对象执行规则评估，并生成告警记录
     *
     * @return 生成的告警记录列表
     */
    @Transactional(rollbackFor = Exception.class)
    public List<AlertRecord> scanAndEvaluateAllRules() {
        log.info("开始扫描并评估所有启用的告警规则");
        List<AlertRecord> generatedAlerts = new ArrayList<>();

        try {
            // 获取所有启用的告警规则
            List<AlertRule> enabledRules = alertRuleRepository.findAllEnabled();
            log.info("找到 {} 条启用的告警规则", enabledRules.size());

            // 遍历每个规则，找到对应的目标对象并进行评估
            for (AlertRule rule : enabledRules) {
                try {
                    List<AlertRecord> ruleAlerts = evaluateRuleForAllTargets(rule);
                    generatedAlerts.addAll(ruleAlerts);
                } catch (Exception e) {
                    log.error("评估规则失败，规则ID: {}, 规则名称: {}", rule.getId(), rule.getRuleName(), e);
                }
            }

            log.info("告警规则扫描完成，共生成 {} 条告警记录", generatedAlerts.size());
            return generatedAlerts;

        } catch (Exception e) {
            log.error("扫描告警规则失败", e);
            throw e;
        }
    }

    /**
     * 对指定规则的所有目标对象进行批量评估
     *
     * @param rule 告警规则
     * @return 生成的告警记录列表
     */
    private List<AlertRecord> evaluateRuleForAllTargets(AlertRule rule) {
        List<AlertRecord> alerts = new ArrayList<>();

        try {
            // 使用批量评估方法，一次性采集并评估所有目标
            List<RuleEvaluationResult> results = alertRuleDomainService.evaluateRuleBatch(rule.getId());

            log.debug("规则 {} 批量评估完成，触发告警的目标数: {}",
                    rule.getRuleName(), results.size());

            // 获取规则的目标类型
            String targetType = determineTargetType(rule);
            if (targetType == null) {
                log.warn("无法确定规则的目标类型，规则ID: {}, 规则名称: {}", rule.getId(), rule.getRuleName());
                return alerts;
            }

            // 为每个触发告警的目标创建告警记录
            for (RuleEvaluationResult result : results) {
                if (result.isTriggered()) {
                    Integer targetId = result.getTriggeredMetrics().get(0).getTargetId();
                    AlertRecord alert = createAlertRecordIfNotDuplicate(rule, targetType, targetId, result);
                    if (alert != null) {
                        alerts.add(alert);
                    }
                }
            }

        } catch (Exception e) {
            log.error("批量评估规则失败，规则ID: {}, 规则名称: {}", rule.getId(), rule.getRuleName(), e);
        }

        return alerts;
    }

    /**
     * 确定规则的目标类型
     * 根据规则配置的指标名称推断目标类型
     */
    private String determineTargetType(AlertRule rule) {
        if (!rule.hasConditionConfigs()) {
            return null;
        }

        // 获取第一个条件的指标名称
        String metricName = rule.getConditionConfigs().get(0).getMetric();

        // 根据指标名称判断目标类型
        List<AlertTargetType> targetTypes = AlertTargetType.findTargetTypesByMetric(metricName);

        if (targetTypes.isEmpty()) {
            return null;
        }

        // 返回第一个匹配的目标类型的code
        return targetTypes.get(0).getCode();
    }

    /**
     * 创建告警记录（如果不是重复告警）
     * 检查静默期内是否已有相同目标和规则的告警记录
     *
     * @param rule 告警规则
     * @param targetType 目标类型
     * @param targetId 目标ID
     * @param result 评估结果
     * @return 创建的告警记录，如果是重复告警则返回null
     */
    private AlertRecord createAlertRecordIfNotDuplicate(AlertRule rule, String targetType,
                                                        Integer targetId, RuleEvaluationResult result) {
        // 检查静默期
        if (rule.hasQuietPeriod()) {
            LocalDateTime quietPeriodStart = LocalDateTime.now().minusMinutes(rule.getQuietPeriod());

            // 查找静默期内是否有相同规则和目标的告警
            List<AlertRecord> recentAlerts = alertRecordRepository.findByTarget(
                    AlertTargetType.fromCode(targetType), targetId);

            boolean hasDuplicateInQuietPeriod = recentAlerts.stream()
                    .filter(alert -> alert.getRuleId().equals(rule.getId()))
                    .filter(alert -> alert.getCreateTime().isAfter(quietPeriodStart))
                    .findAny()
                    .isPresent();

            if (hasDuplicateInQuietPeriod) {
                log.debug("静默期内已存在相同告警，跳过创建。规则: {}, 目标: {}:{}",
                        rule.getRuleName(), targetType, targetId);
                return null;
            }
        }

        // 创建告警记录
        AlertRecord alert = AlertRecord.builder()
                .ruleId(rule.getId())
                .ruleName(rule.getRuleName())
                .targetType(AlertTargetType.fromCode(targetType))
                .targetId(targetId)
                .targetName(getTargetName(targetType, targetId))
                .alertLevel(rule.getAlertLevel())
                .alertMessage(rule.getAlertMessage())
                .alertData(buildAlertData(result))
                .status(AlertStatus.PENDING)
                .notifyStatus(NotifyStatus.PENDING)
                .isSelfTask(0)
                .deleted(0)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .build();

        // 保存告警记录
        AlertRecord savedAlert = alertRecordRepository.save(alert);
        log.info("创建告警记录成功。告警ID: {}, 规则: {}, 目标: {}:{}, 级别: {}",
                savedAlert.getId(), rule.getRuleName(), targetType, targetId, rule.getAlertLevel());

        return savedAlert;
    }

    /**
     * 获取目标对象名称
     */
    private String getTargetName(String targetType, Integer targetId) {
        try {
            switch (targetType) {
                case "site":
                    return siteRepository.findById(targetId)
                            .map(site -> site.getSiteName())
                            .orElse("未知站点");

                case "device":
                    return deviceRepository.findById(targetId)
                            .map(device -> device.getDeviceName())
                            .orElse("未知设备");

                case "task":
                    return siteJobInstanceRepository.findByIdWithPlan(targetId) != null
                            ? "任务实例-" + targetId
                            : "未知任务";

                default:
                    return "未知目标";
            }
        } catch (Exception e) {
            log.error("获取目标名称失败，类型: {}, ID: {}", targetType, targetId, e);
            return "获取名称失败";
        }
    }

    /**
     * 构建告警数据（JSON格式）
     */
    private String buildAlertData(RuleEvaluationResult result) {
        if (result.getTriggeredMetrics() == null || result.getTriggeredMetrics().isEmpty()) {
            return "{}";
        }

        // 简单的JSON构建，实际项目中建议使用Jackson或Gson
        StringBuilder json = new StringBuilder("{");
        json.append("\"evaluationTime\":\"").append(result.getEvaluationTime()).append("\",");
        json.append("\"triggeredMetrics\":[");

        for (int i = 0; i < result.getTriggeredMetrics().size(); i++) {
            Metric metric = result.getTriggeredMetrics().get(i);
            if (i > 0) {
                json.append(",");
            }
            json.append("{");
            json.append("\"name\":\"").append(metric.getName()).append("\",");
            json.append("\"value\":").append(metric.getValue()).append(",");
            json.append("\"collectTime\":\"").append(metric.getCollectTime()).append("\"");
            json.append("}");
        }

        json.append("]}");
        return json.toString();
    }

    /**
     * 清理已恢复的告警记录
     * 检查待处理和处理中的告警，如果条件不再满足，标记为已恢复
     */
    @Transactional(rollbackFor = Exception.class)
    public void checkAndRecoverAlerts() {
        log.info("开始检查并恢复已恢复的告警");

        try {
            // 获取待处理和处理中的告警
            List<AlertRecord> activeAlerts = new ArrayList<>();
            activeAlerts.addAll(alertRecordRepository.findByStatus(AlertStatus.PENDING));
            activeAlerts.addAll(alertRecordRepository.findByStatus(AlertStatus.IN_PROGRESS));

            int recoveredCount = 0;
            for (AlertRecord alert : activeAlerts) {
                try {
                    // 重新评估规则
                    RuleEvaluationResult result = alertRuleDomainService.evaluateRule(
                            alert.getRuleId(),
                            alert.getTargetType().getCode(),
                            alert.getTargetId());

                    // 如果规则不再触发，标记为已恢复
                    if (!result.isTriggered()) {
                        alert.recover();
                        alertRecordRepository.update(alert);
                        recoveredCount++;
                        log.info("告警已恢复。告警ID: {}, 规则: {}, 目标: {}:{}",
                                alert.getId(), alert.getRuleName(),
                                alert.getTargetType().getCode(), alert.getTargetId());
                    }
                } catch (Exception e) {
                    log.error("检查告警恢复状态失败，告警ID: {}", alert.getId(), e);
                }
            }

            log.info("告警恢复检查完成，共恢复 {} 条告警", recoveredCount);

        } catch (Exception e) {
            log.error("检查告警恢复状态失败", e);
            throw e;
        }
    }
}
