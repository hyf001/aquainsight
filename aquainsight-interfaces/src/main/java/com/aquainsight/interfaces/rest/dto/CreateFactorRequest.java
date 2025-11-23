package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFactorRequest {
    @NotBlank(message = "Factor code cannot be blank")
    private String factorCode;

    private String nationalCode;

    @NotBlank(message = "Factor name cannot be blank")
    private String factorName;

    private String shortName;

    @NotNull(message = "Device model ID cannot be null")
    private Integer deviceModelId;

    private String category;

    private String unit;

    private BigDecimal upperLimit;

    private BigDecimal lowerLimit;

    private Integer precisionDigits;
}
