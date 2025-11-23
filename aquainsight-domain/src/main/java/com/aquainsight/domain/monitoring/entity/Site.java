package com.aquainsight.domain.monitoring.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 站点实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Site {

    /**
     * 站点ID
     */
    private Integer id;

    /**
     * 站点编码
     */
    private String siteCode;

    /**
     * 站点名称
     */
    private String siteName;

    /**
     * 站点类型(污水/雨水)
     */
    private String siteType;

    /**
     * 站点标签
     */
    private String siteTag;

    /**
     * 经度
     */
    private BigDecimal longitude;

    /**
     * 纬度
     */
    private BigDecimal latitude;

    /**
     * 地址
     */
    private String address;

    /**
     * 企业名称
     */
    private String enterpriseName;

    /**
     * 是否需要自动填报(0-否,1-是)
     */
    private Integer isAutoUpload;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 更新站点信息
     */
    public void updateInfo(String siteName, String siteType, String siteTag,
                          BigDecimal longitude, BigDecimal latitude, String address,
                          String enterpriseName, Integer isAutoUpload) {
        if (siteName != null) {
            this.siteName = siteName;
        }
        if (siteType != null) {
            this.siteType = siteType;
        }
        if (siteTag != null) {
            this.siteTag = siteTag;
        }
        if (longitude != null) {
            this.longitude = longitude;
        }
        if (latitude != null) {
            this.latitude = latitude;
        }
        if (address != null) {
            this.address = address;
        }
        if (enterpriseName != null) {
            this.enterpriseName = enterpriseName;
        }
        if (isAutoUpload != null) {
            this.isAutoUpload = isAutoUpload;
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 是否为污水站点
     */
    public boolean isWastewaterSite() {
        return "污水".equals(this.siteType);
    }

    /**
     * 是否为雨水站点
     */
    public boolean isRainwaterSite() {
        return "雨水".equals(this.siteType);
    }
}
