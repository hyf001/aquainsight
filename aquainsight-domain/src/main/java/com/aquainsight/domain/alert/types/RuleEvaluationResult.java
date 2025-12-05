package com.aquainsight.domain.alert.types;

import com.aquainsight.domain.alert.entity.Metric;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 规则评估结果
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleEvaluationResult {

    /**
     * 是否触发告警
     */
    private boolean triggered;

    /**
     * 触发告警的指标列表
     */
    @Builder.Default
    private List<Metric> triggeredMetrics = new ArrayList<>();

    /**
     * 告警规则ID
     */
    private Integer ruleId;

    /**
     * 告警规则名称
     */
    private String ruleName;

    /**
     * 评估时间
     */
    private java.time.LocalDateTime evaluationTime;

    /**
     * 是否有指标触发
     */
    public boolean hasTriggeredMetrics() {
        return triggeredMetrics != null && !triggeredMetrics.isEmpty();
    }

    /**
     * 添加触发的指标
     */
    public void addTriggeredMetric(Metric metric) {
        if (this.triggeredMetrics == null) {
            this.triggeredMetrics = new ArrayList<>();
        }
        this.triggeredMetrics.add(metric);
    }
}
