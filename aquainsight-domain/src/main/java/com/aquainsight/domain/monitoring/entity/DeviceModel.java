package com.aquainsight.domain.monitoring.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 设备型号实体（设备类型定义）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceModel {

    /**
     * 设备型号ID
     */
    private Integer id;

    /**
     * 型号编码
     */
    private String modelCode;

    /**
     * 型号名称
     */
    private String modelName;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 制造商
     */
    private String manufacturer;

    /**
     * 设备描述
     */
    private String description;

    /**
     * 规格参数
     */
    private String specifications;

    /**
     * 关联的监测因子
     */
    private Factor factor;

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
     * 更新设备型号信息
     */
    public void updateInfo(String modelName, String deviceType, String manufacturer,
                          String description, String specifications, Factor factor) {
        if (modelName != null) {
            this.modelName = modelName;
        }
        if (deviceType != null) {
            this.deviceType = deviceType;
        }
        if (manufacturer != null) {
            this.manufacturer = manufacturer;
        }
        if (description != null) {
            this.description = description;
        }
        if (specifications != null) {
            this.specifications = specifications;
        }
        if (factor != null) {
            this.factor = factor;
        }
        this.updateTime = LocalDateTime.now();
    }
}
