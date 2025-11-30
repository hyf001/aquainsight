package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeviceModelRequest {
    @NotBlank(message = "Model code cannot be blank")
    private String modelCode;

    @NotBlank(message = "Model name cannot be blank")
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
