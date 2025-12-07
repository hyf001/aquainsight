package com.aquainsight.domain.alert.types;

/**
 * 告警状态枚举
 */
public enum AlertStatus {

    /**
     * 未认领 - 告警已触发，等待认领
     */
    PENDING(0, "未认领"),

    /**
     * 已认领 - 告警已被认领
     */
    IN_PROGRESS(1, "已认领"),

    /**
     * 已忽略 - 告警被手动忽略
     */
    IGNORED(2, "已忽略"),

    /**
     * 已恢复 - 告警条件已恢复正常
     */
    RECOVERED(3, "已恢复");

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
