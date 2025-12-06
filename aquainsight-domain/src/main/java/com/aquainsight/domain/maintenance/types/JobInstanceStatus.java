package com.aquainsight.domain.maintenance.types;

/**
 * 任务实例状态枚举
 */
public enum JobInstanceStatus {

    /**
     * 待处理 - 任务已派发，等待开始执行
     */
    PENDING("待处理"),

    /**
     * 进行中 - 任务正在执行
     */
    IN_PROGRESS("进行中"),

    /**
     * 已完成 - 任务已完成
     */
    COMPLETED("已完成"),

    /**
     * 即将过期 - 任务即将到达过期时间
     */
    EXPIRING("即将过期"),

    /**
     * 已逾期 - 任务超过预期时间未完成
     */
    OVERDUE("已逾期"),

    /**
     * 已取消 - 任务被取消
     */
    CANCELLED("已取消");

    private final String description;

    JobInstanceStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
