package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceModelVO {
    private Integer id;

    private String modelCode;

    private String modelName;

    private String deviceType;

    private String manufacturer;

    private String description;

    private String createTime;

    private String updateTime;
}
