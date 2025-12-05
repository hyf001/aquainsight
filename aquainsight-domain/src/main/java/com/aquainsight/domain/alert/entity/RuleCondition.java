package com.aquainsight.domain.alert.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 告警规则条件配置值对象
 * 用于配置告警触发条件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleCondition {

    /**
     * 指标名称
     */
    private String metric;

    /**
     * 比较操作符
     * GT: 大于
     * GTE: 大于等于ß
     * LT: 小于
     * LTE: 小于等于
     * EQ: 等于
     * NEQ: 不等于
     * BETWEEN: 在范围内
     * NOT_BETWEEN: 不在范围内
     */
    private ComparisonOperator operator;

    /**
     * 阈值（单个阈值时使用）
     */
    private BigDecimal threshold;

    /**
     * 最小阈值（范围判断时使用）
     */
    private BigDecimal minThreshold;

    /**
     * 最大阈值（范围判断时使用）
     */
    private BigDecimal maxThreshold;


    /**
     * 比较操作符枚举
     */
    public enum ComparisonOperator {
        /**
         * 大于
         */
        GT(">", "大于"),

        /**
         * 大于等于
         */
        GTE(">=", "大于等于"),

        /**
         * 小于
         */
        LT("<", "小于"),

        /**
         * 小于等于
         */
        LTE("<=", "小于等于"),

        /**
         * 等于
         */
        EQ("=", "等于"),

        /**
         * 不等于
         */
        NEQ("!=", "不等于"),

        /**
         * 在范围内
         */
        BETWEEN("BETWEEN", "在范围内"),

        /**
         * 不在范围内
         */
        NOT_BETWEEN("NOT_BETWEEN", "不在范围内");

        private final String symbol;
        private final String description;

        ComparisonOperator(String symbol, String description) {
            this.symbol = symbol;
            this.description = description;
        }

        public String getSymbol() {
            return symbol;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 验证配置是否有效
     */
    public boolean isValid() {
        if (operator == null) {
            return false;
        }

        // 范围操作符需要最小和最大阈值
        if (operator == ComparisonOperator.BETWEEN || operator == ComparisonOperator.NOT_BETWEEN) {
            return minThreshold != null && maxThreshold != null && minThreshold.compareTo(maxThreshold) <= 0;
        }

        // 其他操作符需要阈值
        return threshold != null;
    }
}
