package com.aquainsight.domain.maintenance.types;

/**
 * 任务调度状态枚举
 */
public enum TaskSchedulerState {
    /**
     * 暂停
     */
    PAUSED("暂停"),

    /**
     * 进行中（正常运维）
     */
    IN_PROGRESS("进行中");

    private final String description;

    TaskSchedulerState(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
