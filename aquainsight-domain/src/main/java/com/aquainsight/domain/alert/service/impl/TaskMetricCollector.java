package com.aquainsight.domain.alert.service.impl;

import com.aquainsight.domain.alert.entity.Metric;
import com.aquainsight.domain.alert.service.MetricCollector;
import com.aquainsight.domain.maintenance.entity.Task;
import com.aquainsight.domain.maintenance.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    private final TaskRepository taskRepository;

    /**
     * 支持的指标列表
     */
    private static final List<String> SUPPORTED_METRICS = Arrays.asList(
            "任务即将到期",
            "任务超时"
    );

    @Override
    public List<Metric> collectAll(String metricName) {
        List<Metric> metrics = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // 根据指标名称直接查询对应状态的任务
        List<Task> jobInstances;
        switch (metricName) {
            case "任务即将到期":
                // 直接查询即将过期状态的任务
                jobInstances = taskRepository.findExpiringInstances();
                for (Task jobInstance : jobInstances) {
                    metrics.add(collectTaskDueSoon(jobInstance, now));
                }
                break;
            case "任务超时":
                // 直接查询已逾期状态的任务
                jobInstances = taskRepository.findOverdueInstances();
                for (Task jobInstance : jobInstances) {
                    metrics.add(collectTaskTimeout(jobInstance, now));
                }
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
    private Metric collectTaskDueSoon(Task jobInstance, LocalDateTime now) {
        Metric metric = new Metric();
        metric.setName("任务即将到期");
        metric.setTargetType("task");
        metric.setTargetId(jobInstance.getId());
        metric.setCollectTime(now);

        // 由于已经通过状态筛选(EXPIRING),直接返回告警值
        metric.setValue(BigDecimal.ONE);

        return metric;
    }

    /**
     * 采集任务超时指标
     * 返回值: 0-未超时, 1-已超时
     */
    private Metric collectTaskTimeout(Task jobInstance, LocalDateTime now) {
        Metric metric = new Metric();
        metric.setName("任务超时");
        metric.setTargetType("task");
        metric.setTargetId(jobInstance.getId());
        metric.setCollectTime(now);

        // 由于已经通过状态筛选(OVERDUE),直接返回告警值
        metric.setValue(BigDecimal.ONE);

        return metric;
    }

    @Override
    public boolean supports(String metricName) {
        return SUPPORTED_METRICS.contains(metricName);
    }
}
