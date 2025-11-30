package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSiteRequest {
    @NotBlank(message = "Site code cannot be blank")
    private String siteCode;

    @NotBlank(message = "Site name cannot be blank")
    private String siteName;

    private String siteType;

    private String siteTag;

    private String longitude;

    private String latitude;

    private String address;

    private Integer enterpriseId;

    private Boolean isAutoUpload;
}
