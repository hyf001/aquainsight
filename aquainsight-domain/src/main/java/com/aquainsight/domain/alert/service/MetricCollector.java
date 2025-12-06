package com.aquainsight.domain.alert.service;

import java.util.List;

import com.aquainsight.domain.alert.entity.Metric;

/**
 * 指标采集器接口
 * 不同类型的指标采集由不同的实现类完成
 */
public interface MetricCollector {

    /**
     * 批量采集指标值
     * 采集指定指标的所有目标对象的指标值
     *
     * @param metricName 指标名称
     * @return 指标列表，包含所有目标对象的指标值
     */
    List<Metric> collectAll(String metricName);

    /**
     * 判断是否支持该指标的采集
     *
     * @param metricName 指标名称
     * @return 是否支持
     */
    boolean supports(String metricName);
}
