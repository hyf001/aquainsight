package com.aquainsight.domain.alert.types;

/**
 * 通知方式枚举
 */
public enum NotifyType {

    /**
     * 短信通知
     */
    SMS("sms", "短信"),

    /**
     * 邮件通知
     */
    EMAIL("email", "邮件"),

    /**
     * 推送通知
     */
    PUSH("push", "推送"),

    /**
     * 微信通知
     */
    WECHAT("wechat", "微信");

    private final String code;
    private final String description;

    NotifyType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 根据code获取枚举
     */
    public static NotifyType fromCode(String code) {
        for (NotifyType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的通知方式: " + code);
    }
}
