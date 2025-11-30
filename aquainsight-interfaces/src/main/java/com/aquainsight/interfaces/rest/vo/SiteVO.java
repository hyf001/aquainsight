package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteVO {
    private Integer id;

    private String siteCode;

    private String siteName;

    private String siteType;

    private String siteTag;

    private String longitude;

    private String latitude;

    private String address;

    private Integer enterpriseId;

    private String enterpriseName;

    private Boolean isAutoUpload;

    private String createTime;

    private String updateTime;
}
