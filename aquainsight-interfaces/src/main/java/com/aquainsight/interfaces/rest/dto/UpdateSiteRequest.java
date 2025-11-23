package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSiteRequest {
    private String siteName;

    private String siteType;

    private String siteTag;

    private String longitude;

    private String latitude;

    private String address;

    private String enterpriseName;

    private Boolean isAutoUpload;
}
