package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 监测因子持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("factor")
public class FactorPO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String factorCode;

    private String nationalCode;

    private String factorName;

    private String shortName;

    private String category;

    private String unit;

    private BigDecimal upperLimit;

    private BigDecimal lowerLimit;

    private Integer precisionDigits;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
