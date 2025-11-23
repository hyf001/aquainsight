package com.aquainsight.domain.monitoring.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 监测因子实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Factor {

    /**
     * 因子ID
     */
    private Integer id;

    /**
     * 因子代码
     */
    private String factorCode;

    /**
     * 国标代码
     */
    private String nationalCode;

    /**
     * 因子名称
     */
    private String factorName;

    /**
     * 简称
     */
    private String shortName;

    /**
     * 所属设备型号ID
     */
    private Integer deviceModelId;

    /**
     * 所属类别(水环境质量/大气环境质量)
     */
    private String category;

    /**
     * 单位
     */
    private String unit;

    /**
     * 上限值
     */
    private BigDecimal upperLimit;

    /**
     * 下限值
     */
    private BigDecimal lowerLimit;

    /**
     * 精度位数
     */
    private Integer precisionDigits;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 更新因子信息
     */
    public void updateInfo(String factorName, String shortName, String category, String unit,
                          BigDecimal upperLimit, BigDecimal lowerLimit, Integer precisionDigits) {
        if (factorName != null) {
            this.factorName = factorName;
        }
        if (shortName != null) {
            this.shortName = shortName;
        }
        if (category != null) {
            this.category = category;
        }
        if (unit != null) {
            this.unit = unit;
        }
        if (upperLimit != null) {
            this.upperLimit = upperLimit;
        }
        if (lowerLimit != null) {
            this.lowerLimit = lowerLimit;
        }
        if (precisionDigits != null) {
            this.precisionDigits = precisionDigits;
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 检查值是否在范围内
     */
    public boolean isValueInRange(BigDecimal value) {
        if (value == null) {
            return false;
        }
        boolean aboveLower = (lowerLimit == null) || (value.compareTo(lowerLimit) >= 0);
        boolean belowUpper = (upperLimit == null) || (value.compareTo(upperLimit) <= 0);
        return aboveLower && belowUpper;
    }

    /**
     * 是否为水环境质量因子
     */
    public boolean isWaterQualityFactor() {
        return "水环境质量".equals(this.category);
    }

    /**
     * 是否为大气环境质量因子
     */
    public boolean isAirQualityFactor() {
        return "大气环境质量".equals(this.category);
    }
}
