package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 企业视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseVO {

    private Integer id;

    private String enterpriseName;

    private String enterpriseCode;

    private String enterpriseTag;

    private String contactPerson;

    private String contactPhone;

    private String address;

    private String description;

    private Long siteCount;

    private String createTime;

    private String updateTime;
}
