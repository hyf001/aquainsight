package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactorVO {
    private Integer id;
    private String factorCode;
    private String nationalCode;
    private String factorName;
    private String shortName;
    private Integer deviceModelId;
    private String modelName;  // 关联的设备型号名称（用于显示）
    private String category;
    private String unit;
    private BigDecimal upperLimit;
    private BigDecimal lowerLimit;
    private Integer precisionDigits;
    private String createTime;
    private String updateTime;
}
