package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 设备实例持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("device")
public class DevicePO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String deviceCode;

    private String deviceName;

    private Integer siteId;

    private Integer deviceModelId;

    private String serialNumber;

    private String installLocation;

    private Integer status;

    private LocalDate installDate;

    private LocalDate maintenanceDate;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
