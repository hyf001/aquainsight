package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDeviceRequest {
    private String deviceName;

    private String serialNumber;

    private String installLocation;

    private String installDate;

    private String maintenanceDate;
}
