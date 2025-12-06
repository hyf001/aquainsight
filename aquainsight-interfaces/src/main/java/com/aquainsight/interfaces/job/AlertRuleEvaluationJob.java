package com.aquainsight.interfaces.job;

import com.aquainsight.application.service.AlertApplicationService;
import com.aquainsight.domain.alert.entity.AlertRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 告警规则评估定时任务
 * 定期扫描所有启用的告警规则，对目标对象进行评估并生成告警记录
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AlertRuleEvaluationJob {

    private final AlertApplicationService alertApplicationService;

    /**
     * 每5分钟执行一次告警规则扫描和评估
     * 检查所有启用的告警规则，对符合条件的目标对象生成告警记录
     */
    @Scheduled(cron = "0 */5 * * * ?")
    public void evaluateAlertRules() {
        log.info("开始执行告警规则评估定时任务，时间: {}", LocalDateTime.now());

        try {
            // 扫描并评估所有告警规则
            List<AlertRecord> generatedAlerts = alertApplicationService.scanAndEvaluateAllRules();

            log.info("告警规则评估定时任务执行完成。共生成 {} 条告警记录", generatedAlerts.size());

            // 记录生成的告警详情（仅记录前10条，避免日志过多）
            int recordCount = Math.min(10, generatedAlerts.size());
            for (int i = 0; i < recordCount; i++) {
                AlertRecord alert = generatedAlerts.get(i);
                log.info("生成告警记录: ID={}, 规则={}, 目标={}:{}, 级别={}",
                        alert.getId(),
                        alert.getRuleName(),
                        alert.getTargetType().getCode(),
                        alert.getTargetId(),
                        alert.getAlertLevel());
            }

            if (generatedAlerts.size() > 10) {
                log.info("...还有 {} 条告警记录未显示", generatedAlerts.size() - 10);
            }

        } catch (Exception e) {
            log.error("告警规则评估定时任务执行失败", e);
        }
    }

    /**
     * 每10分钟执行一次告警恢复检查
     * 检查待处理和处理中的告警，如果条件不再满足则标记为已恢复
     */
    @Scheduled(cron = "0 */10 * * * ?")
    public void checkAlertRecovery() {
        log.info("开始执行告警恢复检查定时任务，时间: {}", LocalDateTime.now());

        try {
            alertApplicationService.checkAndRecoverAlerts();
            log.info("告警恢复检查定时任务执行完成");
        } catch (Exception e) {
            log.error("告警恢复检查定时任务执行失败", e);
        }
    }
}
