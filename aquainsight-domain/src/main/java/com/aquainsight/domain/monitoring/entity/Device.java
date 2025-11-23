package com.aquainsight.domain.monitoring.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 设备实例实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {

    /**
     * 设备实例ID
     */
    private Integer id;

    /**
     * 设备编码(唯一标识)
     */
    private String deviceCode;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 所属站点ID
     */
    private Integer siteId;

    /**
     * 设备型号ID
     */
    private Integer deviceModelId;

    /**
     * 设备序列号
     */
    private String serialNumber;

    /**
     * 安装位置
     */
    private String installLocation;

    /**
     * 状态(0-离线,1-在线,2-故障)
     */
    private Integer status;

    /**
     * 安装日期
     */
    private LocalDate installDate;

    /**
     * 维护日期
     */
    private LocalDate maintenanceDate;

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
     * 更新设备信息
     */
    public void updateInfo(String deviceName, String serialNumber, String installLocation,
                          LocalDate installDate, LocalDate maintenanceDate) {
        if (deviceName != null) {
            this.deviceName = deviceName;
        }
        if (serialNumber != null) {
            this.serialNumber = serialNumber;
        }
        if (installLocation != null) {
            this.installLocation = installLocation;
        }
        if (installDate != null) {
            this.installDate = installDate;
        }
        if (maintenanceDate != null) {
            this.maintenanceDate = maintenanceDate;
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 设置设备在线状态
     */
    public void setOnline() {
        this.status = 1;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 设置设备离线状态
     */
    public void setOffline() {
        this.status = 0;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 设置设备故障状态
     */
    public void setFault() {
        this.status = 2;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 是否在线
     */
    public boolean isOnline() {
        return this.status != null && this.status == 1;
    }

    /**
     * 是否故障
     */
    public boolean isFault() {
        return this.status != null && this.status == 2;
    }

    /**
     * 更新维护日期
     */
    public void updateMaintenanceDate(LocalDate maintenanceDate) {
        this.maintenanceDate = maintenanceDate;
        this.updateTime = LocalDateTime.now();
    }
}
