package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeviceRequest {
    @NotBlank(message = "Device code cannot be blank")
    private String deviceCode;

    @NotBlank(message = "Device name cannot be blank")
    private String deviceName;

    @NotNull(message = "Site ID cannot be null")
    private Integer siteId;

    @NotNull(message = "Device model ID cannot be null")
    private Integer deviceModelId;

    private String serialNumber;

    private String installLocation;

    private String status;

    private String installDate;

    private String maintenanceDate;
}
