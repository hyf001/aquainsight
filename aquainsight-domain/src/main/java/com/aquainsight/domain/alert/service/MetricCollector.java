package com.aquainsight.domain.alert.service;

import java.util.List;

import com.aquainsight.domain.alert.entity.Metric;

/**
 * 指标采集器接口
 * 不同类型的指标采集由不同的实现类完成
 */
public interface MetricCollector {

    /**
     * 采集指标值
     *
     * @param metricName 指标名称
     * @param targetType 目标对象类型(如: site, device等)
     * @param targetId 目标对象ID
     * @return 指标对象，包含指标名称和值
     */
    List<Metric> collect(String metricName, String targetType, Integer targetId);

    /**
     * 判断是否支持该指标的采集
     *
     * @param metricName 指标名称
     * @return 是否支持
     */
    boolean supports(String metricName);
}
