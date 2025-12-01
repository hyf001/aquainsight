package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 站点任务计划视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteJobPlanVO {

    private Integer id;

    private Integer siteId;

    private String siteName;

    private String siteCode;

    private Integer enterpriseId;

    private String enterpriseName;

    private PeriodConfigVO periodConfig;

    private Integer schemeId;

    private String schemeName;

    private Integer departmentId;

    private String departmentName;

    private String jobPlanState;

    private String creator;

    private LocalDateTime createTime;

    private String updater;

    private LocalDateTime updateTime;

    /**
     * 周期配置视图对象
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodConfigVO {
        /**
         * 周期类型: INTERVAL, WEEK, MONTH
         */
        private String periodType;

        /**
         * month 表示每月几日，week表示每周几，interval表示间隔多少天
         */
        private Integer n;
    }
}
