package com.aquainsight.domain.alert.types;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * 告警目标类型枚举
 * 每个目标类型定义了可以采集的指标列表
 */
public enum AlertTargetType {

    /**
     * 站点告警
     * 支持站点级别的监测数据指标
     */
    SITE("site", "站点", Arrays.asList(
            "pH值", "化学需氧量", "氨氮", "总磷", "总氮", "溶解氧", "浊度", "温度",
            "电导率", "流量", "压力"
    )),

    /**
     * 设备告警
     * 支持设备状态相关指标
     */
    DEVICE("device", "设备", Arrays.asList(
            "设备状态", "设备在线", "设备故障", "设备电压",
            "设备电流", "设备温度"
    )),

    /**
     * 任务告警
     * 支持任务执行相关指标
     */
    TASK("task", "任务", Arrays.asList(
            "任务即将到期", "任务超时"
    ));

    private final String code;
    private final String description;
    private final List<String> supportedMetrics;

    AlertTargetType(String code, String description, List<String> supportedMetrics) {
        this.code = code;
        this.description = description;
        this.supportedMetrics = Collections.unmodifiableList(supportedMetrics);
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 获取该目标类型支持的指标列表
     */
    public List<String> getSupportedMetrics() {
        return supportedMetrics;
    }

    /**
     * 判断该目标类型是否支持指定指标
     */
    public boolean supportsMetric(String metricName) {
        return supportedMetrics.contains(metricName);
    }

    /**
     * 根据code获取枚举
     */
    public static AlertTargetType fromCode(String code) {
        for (AlertTargetType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的告警目标类型: " + code);
    }

    /**
     * 根据指标名称查找支持该指标的目标类型列表
     */
    public static List<AlertTargetType> findTargetTypesByMetric(String metricName) {
        return Arrays.stream(values())
                .filter(type -> type.supportsMetric(metricName))
                .collect(java.util.stream.Collectors.toList());
    }
}
