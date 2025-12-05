package com.aquainsight.domain.alert.types;

/**
 * 告警状态枚举
 */
public enum AlertStatus {

    /**
     * 待处理 - 告警已触发，等待处理
     */
    PENDING(0, "待处理"),

    /**
     * 处理中 - 告警正在处理
     */
    IN_PROGRESS(1, "处理中"),

    /**
     * 已处理 - 告警已处理完成
     */
    RESOLVED(2, "已处理"),

    /**
     * 已忽略 - 告警被手动忽略
     */
    IGNORED(3, "已忽略"),

    /**
     * 已恢复 - 告警条件已恢复正常
     */
    RECOVERED(4, "已恢复");

    private final Integer code;
    private final String description;

    AlertStatus(Integer code, String description) {
        this.code = code;
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 根据code获取枚举
     */
    public static AlertStatus fromCode(Integer code) {
        for (AlertStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的告警状态: " + code);
    }
}
