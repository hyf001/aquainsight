package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 站点任务实例实体
 * 根据 site_job_plan 的周期配置生成的实际任务
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteJobInstance {

    /**
     * 任务实例ID
     */
    private Integer id;

    /**
     * 任务计划
     */
    private SiteJobPlan siteJobPlan;

    /**
     * 任务派发时间
     */
    private LocalDateTime triggerTime;

    /**
     * 任务开始时间
     */
    private LocalDateTime startTime;

    /**
     * 任务结束时间
     */
    private LocalDateTime endTime;

    /**
     * 任务状态
     */
    private JobInstanceStatus status;

    /**
     * 任务过期时间
     */
    private LocalDateTime expiredTime;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 任务处理人
     */
    private String operator;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 开始任务
     */
    public void start(String operator) {
        if (this.status == JobInstanceStatus.PENDING) {
            this.status = JobInstanceStatus.IN_PROGRESS;
            this.startTime = LocalDateTime.now();
            this.operator = operator;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理状态的任务才能开始执行");
        }
    }

    /**
     * 完成任务
     */
    public void complete() {
        if (this.status == JobInstanceStatus.IN_PROGRESS) {
            this.status = JobInstanceStatus.COMPLETED;
            this.endTime = LocalDateTime.now();
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有进行中的任务才能完成");
        }
    }

    /**
     * 取消任务
     */
    public void cancel() {
        if (this.status == JobInstanceStatus.PENDING || this.status == JobInstanceStatus.IN_PROGRESS) {
            this.status = JobInstanceStatus.CANCELLED;
            this.endTime = LocalDateTime.now();
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理或进行中的任务才能取消");
        }
    }

    /**
     * 检查并标记为逾期
     */
    public void checkAndMarkOverdue() {
        if (this.expiredTime != null && LocalDateTime.now().isAfter(this.expiredTime)) {
            if (this.status == JobInstanceStatus.PENDING || this.status == JobInstanceStatus.IN_PROGRESS) {
                this.status = JobInstanceStatus.OVERDUE;
                this.updateTime = LocalDateTime.now();
            }
        }
    }

    /**
     * 是否逾期
     */
    public boolean isOverdue() {
        return this.status == JobInstanceStatus.OVERDUE;
    }

    /**
     * 是否已完成
     */
    public boolean isCompleted() {
        return this.status == JobInstanceStatus.COMPLETED;
    }

    /**
     * 是否可以开始
     */
    public boolean canStart() {
        return this.status == JobInstanceStatus.PENDING;
    }

    /**
     * 是否可以完成
     */
    public boolean canComplete() {
        return this.status == JobInstanceStatus.IN_PROGRESS;
    }

    /**
     * 更新处理人
     */
    public void updateOperator(String operator) {
        if (this.status == JobInstanceStatus.PENDING || this.status == JobInstanceStatus.IN_PROGRESS) {
            this.operator = operator;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理或进行中的任务才能更新处理人");
        }
    }

    /**
     * 计算任务执行时长（分钟）
     */
    public Long getExecutionDuration() {
        if (this.startTime == null) {
            return 0L;
        }
        LocalDateTime end = this.endTime != null ? this.endTime : LocalDateTime.now();
        return java.time.Duration.between(this.startTime, end).toMinutes();
    }

    /**
     * 是否在执行中
     */
    public boolean isInProgress() {
        return this.status == JobInstanceStatus.IN_PROGRESS;
    }
}
