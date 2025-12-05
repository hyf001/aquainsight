package com.aquainsight.domain.alert.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Metric {
    private String name;
    private String targetType;
    private Integer targetId;
    private BigDecimal value;
    private LocalDateTime collectTime;
}
