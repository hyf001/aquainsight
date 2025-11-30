package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 站点及其任务计划VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteWithJobPlanVO {

    // 站点信息
    private Integer id;
    private String siteCode;
    private String siteName;
    private String siteType;
    private String siteTag;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private String address;
    private Integer isAutoUpload;
    private Integer enterpriseId;
    private String enterpriseName;
    private String createTime;
    private String updateTime;

    // 任务计划信息（可能为空）
    private Integer jobPlanId;
    private Integer departmentId;
    private String departmentName;
    private Integer schemeId;
    private String schemeName;
    private String schemeCode;
    private PeriodConfigVO periodConfig;
    private String jobPlanState;
    private String jobPlanCreator;
    private String jobPlanCreateTime;
    private String jobPlanUpdater;
    private String jobPlanUpdateTime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodConfigVO {
        private String periodType;
        private Integer n;
    }
}
