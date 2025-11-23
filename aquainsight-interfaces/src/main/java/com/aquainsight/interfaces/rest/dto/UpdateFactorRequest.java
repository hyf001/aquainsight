package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFactorRequest {
    private String factorName;

    private String shortName;

    private String category;

    private String unit;

    private BigDecimal upperLimit;

    private BigDecimal lowerLimit;

    private Integer precisionDigits;
}
