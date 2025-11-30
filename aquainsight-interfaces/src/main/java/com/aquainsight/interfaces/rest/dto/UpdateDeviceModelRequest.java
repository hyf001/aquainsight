package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDeviceModelRequest {
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
}
