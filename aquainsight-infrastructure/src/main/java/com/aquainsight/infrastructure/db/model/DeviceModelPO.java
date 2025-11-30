package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 设备型号持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("device_model")
public class DeviceModelPO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String modelCode;

    private String modelName;

    private String deviceType;

    private String manufacturer;

    private String description;

    /**
     * 规格参数
     */
    private String specifications;

    /**
     * 关联的因子ID (多对一关系)
     */
    private Integer factorId;

    /**
     * 关联的因子对象 (不存储在数据库，用于查询时关联)
     */
    @TableField(exist = false)
    private FactorPO factor;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
