package com.aquainsight.domain.alert.types;

/**
 * 通知状态枚举
 */
public enum NotifyStatus {

    /**
     * 未通知 - 待发送
     */
    PENDING(0, "未通知"),

    /**
     * 已通知 - 发送成功
     */
    SUCCESS(1, "已通知"),

    /**
     * 通知失败 - 发送失败
     */
    FAILED(2, "通知失败");

    private final Integer code;
    private final String description;

    NotifyStatus(Integer code, String description) {
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
    public static NotifyStatus fromCode(Integer code) {
        for (NotifyStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的通知状态: " + code);
    }
}
