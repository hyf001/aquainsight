package com.aquainsight.domain.alert.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 指标采集器注册中心
 * 管理和分发不同类型的指标采集器
 */
@Service
@RequiredArgsConstructor
public class MetricCollectorRegistry {

    private final List<MetricCollector> collectors;
    private final Map<String, MetricCollector> collectorCache = new ConcurrentHashMap<>();

    /**
     * 根据指标名称获取对应的采集器
     *
     * @param metricName 指标名称
     * @return 对应的采集器
     */
    public MetricCollector getCollector(String metricName) {
        // 从缓存中获取
        MetricCollector collector = collectorCache.get(metricName);
        if (collector != null) {
            return collector;
        }

        // 遍历所有采集器，找到支持该指标的采集器
        for (MetricCollector metricCollector : collectors) {
            if (metricCollector.supports(metricName)) {
                collectorCache.put(metricName, metricCollector);
                return metricCollector;
            }
        }

        throw new IllegalArgumentException("未找到支持指标 [" + metricName + "] 的采集器");
    }

    /**
     * 清除缓存
     */
    public void clearCache() {
        collectorCache.clear();
    }
}
