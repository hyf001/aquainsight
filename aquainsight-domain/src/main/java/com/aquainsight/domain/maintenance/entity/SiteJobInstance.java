package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.organization.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 站点任务实例实体
 * 可以从任务计划生成,也可以手动创建
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
     * 站点ID (直接存储,不依赖任务计划)
     */
    private Integer siteId;

    /**
     * 站点 (关联对象,用于查询时填充)
     */
    private Site site;

    /**
     * 方案ID (直接存储,不依赖任务计划)
     */
    private Integer schemeId;

    /**
     * 方案 (关联对象,用于查询时填充)
     */
    private Scheme scheme;

    /**
     * 部门ID (直接存储,不依赖任务计划)
     */
    private Integer departmentId;

    /**
     * 部门 (关联对象,用于查询时填充)
     */
    private Department department;

    /**
     * 任务计划 (可选,如果是从计划生成的任务则有值)
     */
    private Integer siteJobPlanId;

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
        if (this.status == JobInstanceStatus.PENDING || this.status == JobInstanceStatus.EXPIRING) {
            this.status = JobInstanceStatus.IN_PROGRESS;
            this.startTime = LocalDateTime.now();
            this.operator = operator;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理或即将过期状态的任务才能开始执行");
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
        if (this.status == JobInstanceStatus.PENDING
            || this.status == JobInstanceStatus.IN_PROGRESS
            || this.status == JobInstanceStatus.EXPIRING) {
            this.status = JobInstanceStatus.CANCELLED;
            this.endTime = LocalDateTime.now();
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理、进行中或即将过期的任务才能取消");
        }
    }

    /**
     * 检查并更新过期状态（即将过期或已逾期）
     * @param expiringThresholdHours 即将过期的阈值（小时数）
     */
    public void checkAndUpdateExpirationStatus(int expiringThresholdHours) {
        if (this.expiredTime == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiringThreshold = this.expiredTime.minusHours(expiringThresholdHours);

        // 只处理待处理、进行中和即将过期的任务
        if (this.status != JobInstanceStatus.PENDING
            && this.status != JobInstanceStatus.IN_PROGRESS
            && this.status != JobInstanceStatus.EXPIRING) {
            return;
        }

        // 已经过期，标记为逾期
        if (now.isAfter(this.expiredTime)) {
            this.status = JobInstanceStatus.OVERDUE;
            this.updateTime = now;
        }
        // 即将过期但还未过期
        else if (now.isAfter(expiringThreshold)) {
            this.status = JobInstanceStatus.EXPIRING;
            this.updateTime = now;
        }
    }

    /**
     * 检查并标记为逾期（兼容旧方法）
     */
    @Deprecated
    public void checkAndMarkOverdue() {
        checkAndUpdateExpirationStatus(24);
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
        return this.status == JobInstanceStatus.PENDING || this.status == JobInstanceStatus.EXPIRING;
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
        if (this.status == JobInstanceStatus.PENDING
            || this.status == JobInstanceStatus.IN_PROGRESS
            || this.status == JobInstanceStatus.EXPIRING) {
            this.operator = operator;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理、进行中或即将过期的任务才能更新处理人");
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
