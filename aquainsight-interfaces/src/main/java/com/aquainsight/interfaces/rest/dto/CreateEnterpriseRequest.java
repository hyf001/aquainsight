package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 创建企业请求
 */
@Data
public class CreateEnterpriseRequest {

    @NotBlank(message = "企业名称不能为空")
    private String enterpriseName;

    @NotBlank(message = "企业编码不能为空")
    private String enterpriseCode;

    private String enterpriseTag;

    private String contactPerson;

    private String contactPhone;

    private String address;

    private String description;
}
