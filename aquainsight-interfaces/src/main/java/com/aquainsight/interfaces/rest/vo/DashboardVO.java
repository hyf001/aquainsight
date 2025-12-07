package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 首页看板数据VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardVO {

    /**
     * 站点统计
     */
    private SiteStatistics siteStatistics;

    /**
     * 设备统计
     */
    private DeviceStatistics deviceStatistics;

    /**
     * 任务统计
     */
    private TaskStatistics taskStatistics;

    /**
     * 告警统计
     */
    private AlertStatistics alertStatistics;

    /**
     * 组织统计
     */
    private OrganizationStatistics organizationStatistics;

    /**
     * 站点统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SiteStatistics {
        /**
         * 站点总数
         */
        private Long totalCount;

        /**
         * 污水站点数
         */
        private Long wastewaterCount;

        /**
         * 雨水站点数
         */
        private Long rainwaterCount;

        /**
         * 需要自动填报的站点数
         */
        private Long autoUploadCount;
    }

    /**
     * 设备统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceStatistics {
        /**
         * 设备总数
         */
        private Long totalCount;

        /**
         * 在线设备数
         */
        private Long onlineCount;

        /**
         * 离线设备数
         */
        private Long offlineCount;

        /**
         * 故障设备数
         */
        private Long faultCount;
    }

    /**
     * 任务统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskStatistics {
        /**
         * 任务总数
         */
        private Long totalCount;

        /**
         * 待处理任务数
         */
        private Long pendingCount;

        /**
         * 进行中任务数
         */
        private Long inProgressCount;

        /**
         * 已完成任务数
         */
        private Long completedCount;

        /**
         * 已超期任务数
         */
        private Long overdueCount;

        /**
         * 今日新增任务数
         */
        private Long todayNewCount;
    }

    /**
     * 告警统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertStatistics {
        /**
         * 告警总数
         */
        private Long totalCount;

        /**
         * 待处理告警数
         */
        private Long pendingCount;

        /**
         * 处理中告警数
         */
        private Long inProgressCount;

        /**
         * 已恢复告警数
         */
        private Long recoveredCount;

        /**
         * 紧急告警数
         */
        private Long urgentCount;

        /**
         * 重要告警数
         */
        private Long importantCount;

        /**
         * 今日新增告警数
         */
        private Long todayNewCount;
    }

    /**
     * 组织统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizationStatistics {
        /**
         * 企业总数
         */
        private Long enterpriseCount;

        /**
         * 部门总数
         */
        private Long departmentCount;

        /**
         * 用户总数
         */
        private Long userCount;

        /**
         * 在线用户数
         */
        private Long activeUserCount;
    }
}
