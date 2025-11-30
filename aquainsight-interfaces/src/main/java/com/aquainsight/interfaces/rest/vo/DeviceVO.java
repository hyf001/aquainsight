package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceVO {
    private Integer id;
    private String deviceCode;
    private String deviceName;
    private Integer siteId;
    private String siteName;  // 关联的站点名称（用于显示）
    private Integer deviceModelId;
    private String modelName;  // 关联的设备型号名称（用于显示）
    private String serialNumber;
    private String installLocation;
    private Integer status;
    private String installDate;
    private String maintenanceDate;
    private String createTime;
    private String updateTime;

    // 通过设备型号关联的信息
    private String manufacturer;  // 制造商
    private String range;  // 量程（基于关联因子的上下限）
    private Integer factorId;  // 关联因子ID
    private String factorName;  // 关联因子名称
}
