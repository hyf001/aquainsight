package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.DashboardApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.interfaces.rest.vo.DashboardVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 首页看板控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardApplicationService dashboardApplicationService;

    /**
     * 获取首页看板数据
     */
    @GetMapping("/overview")
    public Response<DashboardVO> getDashboardOverview() {
        try {
            // 获取各项统计数据
            DashboardApplicationService.SiteStatisticsDTO siteStats =
                    dashboardApplicationService.getSiteStatistics();
            DashboardApplicationService.DeviceStatisticsDTO deviceStats =
                    dashboardApplicationService.getDeviceStatistics();
            DashboardApplicationService.TaskStatisticsDTO taskStats =
                    dashboardApplicationService.getTaskStatistics();
            DashboardApplicationService.AlertStatisticsDTO alertStats =
                    dashboardApplicationService.getAlertStatistics();
            DashboardApplicationService.OrganizationStatisticsDTO orgStats =
                    dashboardApplicationService.getOrganizationStatistics();

            // 组装VO
            DashboardVO dashboard = DashboardVO.builder()
                    .siteStatistics(DashboardVO.SiteStatistics.builder()
                            .totalCount(siteStats.getTotalCount())
                            .wastewaterCount(siteStats.getWastewaterCount())
                            .rainwaterCount(siteStats.getRainwaterCount())
                            .autoUploadCount(siteStats.getAutoUploadCount())
                            .build())
                    .deviceStatistics(DashboardVO.DeviceStatistics.builder()
                            .totalCount(deviceStats.getTotalCount())
                            .onlineCount(deviceStats.getOnlineCount())
                            .offlineCount(deviceStats.getOfflineCount())
                            .faultCount(deviceStats.getFaultCount())
                            .build())
                    .taskStatistics(DashboardVO.TaskStatistics.builder()
                            .totalCount(taskStats.getTotalCount())
                            .pendingCount(taskStats.getPendingCount())
                            .inProgressCount(taskStats.getInProgressCount())
                            .completedCount(taskStats.getCompletedCount())
                            .overdueCount(taskStats.getOverdueCount())
                            .todayNewCount(taskStats.getTodayNewCount())
                            .build())
                    .alertStatistics(DashboardVO.AlertStatistics.builder()
                            .totalCount(alertStats.getTotalCount())
                            .pendingCount(alertStats.getPendingCount())
                            .inProgressCount(alertStats.getInProgressCount())
                            .recoveredCount(alertStats.getRecoveredCount())
                            .urgentCount(alertStats.getUrgentCount())
                            .importantCount(alertStats.getImportantCount())
                            .todayNewCount(alertStats.getTodayNewCount())
                            .build())
                    .organizationStatistics(DashboardVO.OrganizationStatistics.builder()
                            .enterpriseCount(orgStats.getEnterpriseCount())
                            .departmentCount(orgStats.getDepartmentCount())
                            .userCount(orgStats.getUserCount())
                            .activeUserCount(orgStats.getActiveUserCount())
                            .build())
                    .build();

            return Response.success(dashboard);
        } catch (Exception e) {
            log.error("获取首页看板数据失败", e);
            return Response.error("获取首页看板数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取站点统计数据
     */
    @GetMapping("/statistics/site")
    public Response<DashboardVO.SiteStatistics> getSiteStatistics() {
        try {
            DashboardApplicationService.SiteStatisticsDTO stats =
                    dashboardApplicationService.getSiteStatistics();

            DashboardVO.SiteStatistics siteStatistics = DashboardVO.SiteStatistics.builder()
                    .totalCount(stats.getTotalCount())
                    .wastewaterCount(stats.getWastewaterCount())
                    .rainwaterCount(stats.getRainwaterCount())
                    .autoUploadCount(stats.getAutoUploadCount())
                    .build();

            return Response.success(siteStatistics);
        } catch (Exception e) {
            log.error("获取站点统计数据失败", e);
            return Response.error("获取站点统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取设备统计数据
     */
    @GetMapping("/statistics/device")
    public Response<DashboardVO.DeviceStatistics> getDeviceStatistics() {
        try {
            DashboardApplicationService.DeviceStatisticsDTO stats =
                    dashboardApplicationService.getDeviceStatistics();

            DashboardVO.DeviceStatistics deviceStatistics = DashboardVO.DeviceStatistics.builder()
                    .totalCount(stats.getTotalCount())
                    .onlineCount(stats.getOnlineCount())
                    .offlineCount(stats.getOfflineCount())
                    .faultCount(stats.getFaultCount())
                    .build();

            return Response.success(deviceStatistics);
        } catch (Exception e) {
            log.error("获取设备统计数据失败", e);
            return Response.error("获取设备统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取任务统计数据
     */
    @GetMapping("/statistics/task")
    public Response<DashboardVO.TaskStatistics> getTaskStatistics() {
        try {
            DashboardApplicationService.TaskStatisticsDTO stats =
                    dashboardApplicationService.getTaskStatistics();

            DashboardVO.TaskStatistics taskStatistics = DashboardVO.TaskStatistics.builder()
                    .totalCount(stats.getTotalCount())
                    .pendingCount(stats.getPendingCount())
                    .inProgressCount(stats.getInProgressCount())
                    .completedCount(stats.getCompletedCount())
                    .overdueCount(stats.getOverdueCount())
                    .todayNewCount(stats.getTodayNewCount())
                    .build();

            return Response.success(taskStatistics);
        } catch (Exception e) {
            log.error("获取任务统计数据失败", e);
            return Response.error("获取任务统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取告警统计数据
     */
    @GetMapping("/statistics/alert")
    public Response<DashboardVO.AlertStatistics> getAlertStatistics() {
        try {
            DashboardApplicationService.AlertStatisticsDTO stats =
                    dashboardApplicationService.getAlertStatistics();

            DashboardVO.AlertStatistics alertStatistics = DashboardVO.AlertStatistics.builder()
                    .totalCount(stats.getTotalCount())
                    .pendingCount(stats.getPendingCount())
                    .inProgressCount(stats.getInProgressCount())
                    .recoveredCount(stats.getRecoveredCount())
                    .urgentCount(stats.getUrgentCount())
                    .importantCount(stats.getImportantCount())
                    .todayNewCount(stats.getTodayNewCount())
                    .build();

            return Response.success(alertStatistics);
        } catch (Exception e) {
            log.error("获取告警统计数据失败", e);
            return Response.error("获取告警统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取组织统计数据
     */
    @GetMapping("/statistics/organization")
    public Response<DashboardVO.OrganizationStatistics> getOrganizationStatistics() {
        try {
            DashboardApplicationService.OrganizationStatisticsDTO stats =
                    dashboardApplicationService.getOrganizationStatistics();

            DashboardVO.OrganizationStatistics orgStatistics = DashboardVO.OrganizationStatistics.builder()
                    .enterpriseCount(stats.getEnterpriseCount())
                    .departmentCount(stats.getDepartmentCount())
                    .userCount(stats.getUserCount())
                    .activeUserCount(stats.getActiveUserCount())
                    .build();

            return Response.success(orgStatistics);
        } catch (Exception e) {
            log.error("获取组织统计数据失败", e);
            return Response.error("获取组织统计数据失败: " + e.getMessage());
        }
    }
}
