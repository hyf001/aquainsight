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
}
