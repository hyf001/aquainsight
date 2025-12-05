package com.aquainsight.domain.alert.types;

/**
 * 告警级别枚举
 */
public enum AlertLevel {

    /**
     * 紧急 - 需要立即处理
     */
    URGENT(1, "紧急"),

    /**
     * 重要 - 需要优先处理
     */
    IMPORTANT(2, "重要"),

    /**
     * 一般 - 正常处理
     */
    NORMAL(3, "一般"),

    /**
     * 提示 - 仅提示信息
     */
    INFO(4, "提示");

    private final Integer code;
    private final String description;

    AlertLevel(Integer code, String description) {
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
    public static AlertLevel fromCode(Integer code) {
        for (AlertLevel level : values()) {
            if (level.code.equals(code)) {
                return level;
            }
        }
        throw new IllegalArgumentException("未知的告警级别: " + code);
    }
}
