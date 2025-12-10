package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.TaskSchedulerState;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.organization.entity.Department;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 任务调度
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskScheduler {

    /**
     * ID
     */
    private Integer id;

    /**
     * 站点
     */
    private Site site;

    /**
     * 周期计划
     */
    private PeriodConfig periodConfig;

    /**
     * 运维小组
     */
    private Department department;

    /**
     * 任务模版
     */
    private TaskTemplate taskTemplate;

    /**
     * 任务调度状态
     */
    private TaskSchedulerState taskSchedulerState;

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
     * 更新站点维护配置信息
     */
    public void updateInfo(PeriodConfig periodConfig, TaskTemplate taskTemplate, String updater) {
        if (periodConfig != null) {
            this.periodConfig = periodConfig;
        }
        if (taskTemplate != null) {
            this.taskTemplate = taskTemplate;
        }
        this.updater = updater;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 计算下次维护时间
     */
    public LocalDateTime calculateNextMaintenanceTime(LocalDateTime lastMaintenanceTime) {
        if (periodConfig == null || lastMaintenanceTime == null) {
            return null;
        }

        switch (periodConfig.getPertioType()) {
            case INTERVAL:
                return lastMaintenanceTime.plusDays(periodConfig.getN());
            case WEEK:
                // 每周的第n天
                return calculateNextWeekDay(lastMaintenanceTime, periodConfig.getN());
            case MONTH:
                // 每月的第n日
                return calculateNextMonthDay(lastMaintenanceTime, periodConfig.getN());
            default:
                return null;
        }
    }

    /**
     * 计算下一个周几
     */
    private LocalDateTime calculateNextWeekDay(LocalDateTime from, int dayOfWeek) {
        int currentDayOfWeek = from.getDayOfWeek().getValue();
        int daysToAdd = (dayOfWeek - currentDayOfWeek + 7) % 7;
        if (daysToAdd == 0) {
            daysToAdd = 7;
        }
        return from.plusDays(daysToAdd);
    }

    /**
     * 计算下一个月的第几天
     */
    private LocalDateTime calculateNextMonthDay(LocalDateTime from, int dayOfMonth) {
        LocalDateTime nextMonth = from.plusMonths(1);
        return nextMonth.withDayOfMonth(Math.min(dayOfMonth, nextMonth.toLocalDate().lengthOfMonth()));
    }

    /**
     * 是否需要维护
     */
    public boolean needsMaintenance(LocalDateTime lastMaintenanceTime) {
        LocalDateTime nextTime = calculateNextMaintenanceTime(lastMaintenanceTime);
        return nextTime != null && LocalDateTime.now().isAfter(nextTime);
    }
}
