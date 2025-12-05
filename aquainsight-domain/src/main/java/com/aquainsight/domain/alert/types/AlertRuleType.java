package com.aquainsight.domain.alert.types;

import java.util.Arrays;
import java.util.List;

/**
 * 告警规则类型枚举
 * 每个类型可以绑定支持的指标列表
 */
public enum AlertRuleType {

    /**
     * 阈值告警 - 监测数据超过阈值
     * 支持所有监测因子的阈值判断
     */
    THRESHOLD("threshold", "阈值告警", true),

    /**
     * 离线告警 - 设备离线
     * 不需要绑定指标，基于设备状态判断
     */
    OFFLINE("offline", "离线告警", false),

    /**
     * 故障告警 - 设备故障
     * 不需要绑定指标，基于设备故障状态判断
     */
    FAULT("fault", "故障告警", false),

    /**
     * 超时告警 - 任务超时
     * 不需要绑定指标，基于任务执行时间判断
     */
    TIMEOUT("timeout", "超时告警", false),

    /**
     * 异常告警 - 数据异常
     * 支持所有监测因子的异常判断（如数据突变、离群值等）
     */
    ANOMALY("anomaly", "异常告警", true);

    private final String code;
    private final String description;
    private final boolean supportFactors;

    AlertRuleType(String code, String description, boolean supportFactors) {
        this.code = code;
        this.description = description;
        this.supportFactors = supportFactors;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 是否支持绑定监测因子
     */
    public boolean isSupportFactors() {
        return supportFactors;
    }

    /**
     * 是否需要配置条件
     * 阈值告警和异常告警需要配置具体的条件
     */
    public boolean needConditionConfig() {
        return this == THRESHOLD || this == ANOMALY;
    }

    /**
     * 是否基于设备状态的告警
     */
    public boolean isDeviceStatusBased() {
        return this == OFFLINE || this == FAULT;
    }

    /**
     * 是否基于任务的告警
     */
    public boolean isTaskBased() {
        return this == TIMEOUT;
    }

    /**
     * 是否基于监测数据的告警
     */
    public boolean isDataBased() {
        return this == THRESHOLD || this == ANOMALY;
    }

    /**
     * 根据code获取枚举
     */
    public static AlertRuleType fromCode(String code) {
        for (AlertRuleType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的告警规则类型: " + code);
    }

    /**
     * 获取所有支持因子绑定的告警类型
     */
    public static List<AlertRuleType> getFactorSupportedTypes() {
        return Arrays.asList(THRESHOLD, ANOMALY);
    }

    /**
     * 获取所有基于设备状态的告警类型
     */
    public static List<AlertRuleType> getDeviceStatusTypes() {
        return Arrays.asList(OFFLINE, FAULT);
    }
}
