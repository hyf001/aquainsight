package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 站点及其任务调度VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteWithTaskSchedulerVO {

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

    // 任务调度信息（可能为空）
    private Integer taskSchedulerId;
    private Integer departmentId;
    private String departmentName;
    private Integer taskTemplateId;
    private String taskTemplateName;
    private String taskTemplateCode;
    private PeriodConfigVO periodConfig;
    private String taskSchedulerState;
    private String taskSchedulerCreator;
    private String taskSchedulerCreateTime;
    private String taskSchedulerUpdater;
    private String taskSchedulerUpdateTime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodConfigVO {
        private String periodType;
        private Integer n;
    }
}
