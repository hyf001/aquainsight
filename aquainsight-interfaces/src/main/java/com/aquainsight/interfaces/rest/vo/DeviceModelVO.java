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

    /**
     * 规格参数
     */
    private String specifications;

    /**
     * 关联的因子ID (多对一关系)
     */
    private Integer factorId;

    /**
     * 关联的因子对象
     */
    private FactorVO factor;

    private String createTime;

    private String updateTime;
}
