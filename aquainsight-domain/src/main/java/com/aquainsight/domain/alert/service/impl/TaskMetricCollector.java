package com.aquainsight.domain.alert.service.impl;

import com.aquainsight.domain.alert.entity.Metric;
import com.aquainsight.domain.alert.service.MetricCollector;
import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 任务指标采集器
 * 负责采集站点作业实例相关的告警指标
 */
@Component
@RequiredArgsConstructor
public class TaskMetricCollector implements MetricCollector {

    private final SiteJobInstanceRepository siteJobInstanceRepository;

    /**
     * 支持的指标列表
     */
    private static final List<String> SUPPORTED_METRICS = Arrays.asList(
            "任务即将到期",
            "任务超时"
    );

    /**
     * 任务即将到期的阈值（小时）
     */
    private static final int TASK_DUE_SOON_THRESHOLD_HOURS = 24;

    @Override
    public List<Metric> collect(String metricName, String targetType, Integer targetId) {
        List<Metric> metrics = new ArrayList<>();

        // 验证目标类型
        if (!"task".equals(targetType)) {
            return metrics;
        }

        // 根据站点作业实例ID查询
        SiteJobInstance jobInstance = siteJobInstanceRepository.findById(targetId);
        if (jobInstance == null) {
            return metrics;
        }

        LocalDateTime now = LocalDateTime.now();

        // 根据指标名称采集不同的指标
        switch (metricName) {
            case "任务即将到期":
                metrics.add(collectTaskDueSoon(jobInstance, now));
                break;
            case "任务超时":
                metrics.add(collectTaskTimeout(jobInstance, now));
                break;
            default:
                // 不支持的指标
                break;
        }

        return metrics;
    }

    /**
     * 采集任务即将到期指标
     * 返回值: 0-未到期, 1-即将到期
     */
    private Metric collectTaskDueSoon(SiteJobInstance jobInstance, LocalDateTime now) {
        Metric metric = new Metric();
        metric.setName("任务即将到期");
        metric.setTargetType("task");
        metric.setTargetId(jobInstance.getId());
        metric.setCollectTime(now);

        // 如果任务已完成或已逾期，不需要告警
        if (jobInstance.isCompleted() || jobInstance.isOverdue()) {
            metric.setValue(BigDecimal.ZERO);
            return metric;
        }

        // 如果没有过期时间，无法判断是否即将到期
        if (jobInstance.getExpiredTime() == null) {
            metric.setValue(BigDecimal.ZERO);
            return metric;
        }

        // 计算距离过期时间的小时数
        long hoursUntilDue = ChronoUnit.HOURS.between(now, jobInstance.getExpiredTime());

        // 如果在阈值范围内且未超时，则即将到期
        if (hoursUntilDue > 0 && hoursUntilDue <= TASK_DUE_SOON_THRESHOLD_HOURS) {
            metric.setValue(BigDecimal.ONE);
        } else {
            metric.setValue(BigDecimal.ZERO);
        }

        return metric;
    }

    /**
     * 采集任务超时指标
     * 返回值: 0-未超时, 1-已超时
     */
    private Metric collectTaskTimeout(SiteJobInstance jobInstance, LocalDateTime now) {
        Metric metric = new Metric();
        metric.setName("任务超时");
        metric.setTargetType("task");
        metric.setTargetId(jobInstance.getId());
        metric.setCollectTime(now);

        // 如果任务已完成，不需要告警
        if (jobInstance.isCompleted()) {
            metric.setValue(BigDecimal.ZERO);
            return metric;
        }

        // 如果没有过期时间，无法判断是否超时
        if (jobInstance.getExpiredTime() == null) {
            metric.setValue(BigDecimal.ZERO);
            return metric;
        }

        // 如果当前时间已经超过过期时间，则超时
        // 或者任务状态已经是逾期状态
        if (now.isAfter(jobInstance.getExpiredTime()) || jobInstance.isOverdue()) {
            metric.setValue(BigDecimal.ONE);
        } else {
            metric.setValue(BigDecimal.ZERO);
        }

        return metric;
    }

    @Override
    public boolean supports(String metricName) {
        return SUPPORTED_METRICS.contains(metricName);
    }
}
