package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

/**
 * 更新企业请求
 */
@Data
public class UpdateEnterpriseRequest {

    private String enterpriseName;

    private String enterpriseTag;

    private String contactPerson;

    private String contactPhone;

    private String address;

    private String description;
}
