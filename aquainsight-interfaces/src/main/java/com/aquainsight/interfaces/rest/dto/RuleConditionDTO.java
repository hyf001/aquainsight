package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 告警规则条件DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleConditionDTO {

    /**
     * 指标名称
     */
    @NotBlank(message = "指标名称不能为空")
    private String metric;

    /**
     * 比较操作符: GT, GTE, LT, LTE, EQ, NEQ, BETWEEN, NOT_BETWEEN
     */
    @NotNull(message = "比较操作符不能为空")
    private String operator;

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
}
