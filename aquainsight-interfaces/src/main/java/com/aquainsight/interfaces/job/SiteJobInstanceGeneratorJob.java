package com.aquainsight.interfaces.job;

import com.aquainsight.application.service.MaintenanceApplicationService;
import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务实例生成定时任务
 * 根据站点任务计划的周期配置，自动生成任务实例
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SiteJobInstanceGeneratorJob {

    private final MaintenanceApplicationService maintenanceApplicationService;

    /**
     * 每天凌晨1点执行任务实例生成
     * 检查所有启用中的任务计划，根据周期配置生成下一周期的任务实例
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void generateJobInstances() {
        log.info("开始执行站点任务实例生成定时任务，时间: {}", LocalDateTime.now());

        try {
            // 调用应用服务生成所有任务实例
            List<SiteJobInstance> generatedInstances =
                    maintenanceApplicationService.generateNextInstancesForAllActivePlans("SYSTEM");

            log.info("站点任务实例生成定时任务执行完成。成功生成 {} 个任务实例",
                    generatedInstances.size());

            // 记录生成的任务实例详情
            for (SiteJobInstance instance : generatedInstances) {
                log.info("成功为站点 {} 生成任务实例，派发时间: {}",
                        instance.getSiteJobPlan() != null && instance.getSiteJobPlan().getSite() != null
                                ? instance.getSiteJobPlan().getSite().getSiteName()
                                : "未知站点",
                        instance.getTriggerTime());
            }

        } catch (Exception e) {
            log.error("站点任务实例生成定时任务执行失败", e);
        }
    }

    /**
     * 每小时执行一次，检查并标记逾期任务
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void checkOverdueInstances() {
        log.info("开始执行逾期任务检查定时任务，时间: {}", LocalDateTime.now());

        try {
            maintenanceApplicationService.checkAndMarkAllOverdueInstances();
            log.info("逾期任务检查定时任务执行完成");
        } catch (Exception e) {
            log.error("逾期任务检查定时任务执行失败", e);
        }
    }

    /**
     * 每30分钟执行一次，检查并更新任务过期状态（即将过期和已逾期）
     * 即将过期的阈值设置为24小时
     */
    @Scheduled(cron = "0 */30 * * * ?")
    public void updateExpirationStatus() {
        log.info("开始执行任务过期状态更新定时任务，时间: {}", LocalDateTime.now());

        try {
            // 即将过期阈值设置为24小时
            int expiringThresholdHours = 24;
            maintenanceApplicationService.checkAndUpdateExpirationStatus(expiringThresholdHours);
            log.info("任务过期状态更新定时任务执行完成");
        } catch (Exception e) {
            log.error("任务过期状态更新定时任务执行失败", e);
        }
    }
}
