package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 配置站点任务调度请求
 */
@Data
public class ConfigureTaskSchedulerRequest {

    private Integer siteId;

    private PeriodConfigDTO periodConfig;

    private Integer taskTemplateId;

    private Integer departmentId;

    /**
     * 周期配置DTO
     */
    @Data
    public static class PeriodConfigDTO {
        /**
         * 周期类型: INTERVAL(间隔天数), WEEK(每周几), MONTH(每月几日)
         */
        @NotNull(message = "周期类型不能为空")
        private String periodType;

        /**
         * month 表示每月几日，week表示每周几，interval表示间隔多少天
         */
        @NotNull(message = "周期参数不能为空")
        private Integer n;
    }
}
