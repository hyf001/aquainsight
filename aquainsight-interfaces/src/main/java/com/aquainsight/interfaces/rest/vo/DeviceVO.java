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
}
