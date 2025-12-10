package com.aquainsight.application.service;

import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.infrastructure.db.dao.AlertRecordDao;
import com.aquainsight.infrastructure.db.dao.DepartmentDao;
import com.aquainsight.infrastructure.db.dao.DeviceDao;
import com.aquainsight.infrastructure.db.dao.EnterpriseDao;
import com.aquainsight.infrastructure.db.dao.SiteDao;
import com.aquainsight.infrastructure.db.dao.TaskDao;
import com.aquainsight.infrastructure.db.dao.UserDao;
import com.aquainsight.infrastructure.db.model.AlertRecordPO;
import com.aquainsight.infrastructure.db.model.DepartmentPO;
import com.aquainsight.infrastructure.db.model.DevicePO;
import com.aquainsight.infrastructure.db.model.EnterprisePO;
import com.aquainsight.infrastructure.db.model.SitePO;
import com.aquainsight.infrastructure.db.model.TaskPO;
import com.aquainsight.infrastructure.db.model.UserPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 首页看板应用服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardApplicationService {

    private final SiteDao siteDao;
    private final DeviceDao deviceDao;
    private final TaskDao taskDao;
    private final AlertRecordDao alertRecordDao;
    private final EnterpriseDao enterpriseDao;
    private final DepartmentDao departmentDao;
    private final UserDao userDao;

    /**
     * 获取站点统计数据
     */
    public SiteStatisticsDTO getSiteStatistics() {
        try {
            // 总站点数（@TableLogic会自动过滤已删除的记录）
            long totalCount = siteDao.selectCount(new LambdaQueryWrapper<>());

            // 污水站点数
            long wastewaterCount = siteDao.selectCount(
                    new LambdaQueryWrapper<SitePO>()
                            .eq(SitePO::getSiteType, "污水")
            );

            // 雨水站点数
            long rainwaterCount = siteDao.selectCount(
                    new LambdaQueryWrapper<SitePO>()
                            .eq(SitePO::getSiteType, "雨水")
            );

            // 需要自动填报的站点数
            long autoUploadCount = siteDao.selectCount(
                    new LambdaQueryWrapper<SitePO>()
                            .eq(SitePO::getIsAutoUpload, 1)
            );

            return SiteStatisticsDTO.builder()
                    .totalCount(totalCount)
                    .wastewaterCount(wastewaterCount)
                    .rainwaterCount(rainwaterCount)
                    .autoUploadCount(autoUploadCount)
                    .build();
        } catch (Exception e) {
            log.error("获取站点统计数据失败", e);
            throw new RuntimeException("获取站点统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取设备统计数据
     */
    public DeviceStatisticsDTO getDeviceStatistics() {
        try {
            // 设备总数（@TableLogic会自动过滤已删除的记录）
            long totalCount = deviceDao.selectCount(new LambdaQueryWrapper<>());

            // 在线设备数（状态=1）
            long onlineCount = deviceDao.selectCount(
                    new LambdaQueryWrapper<DevicePO>()
                            .eq(DevicePO::getStatus, 1)
            );

            // 离线设备数（状态=0）
            long offlineCount = deviceDao.selectCount(
                    new LambdaQueryWrapper<DevicePO>()
                            .eq(DevicePO::getStatus, 0)
            );

            // 故障设备数（状态=2）
            long faultCount = deviceDao.selectCount(
                    new LambdaQueryWrapper<DevicePO>()
                            .eq(DevicePO::getStatus, 2)
            );

            return DeviceStatisticsDTO.builder()
                    .totalCount(totalCount)
                    .onlineCount(onlineCount)
                    .offlineCount(offlineCount)
                    .faultCount(faultCount)
                    .build();
        } catch (Exception e) {
            log.error("获取设备统计数据失败", e);
            throw new RuntimeException("获取设备统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取任务统计数据
     */
    public TaskStatisticsDTO getTaskStatistics() {
        try {
            // 任务总数（@TableLogic会自动过滤已删除的记录）
            long totalCount = taskDao.selectCount(new LambdaQueryWrapper<>());

            // 待处理任务数（状态=PENDING）
            long pendingCount = taskDao.selectCount(
                    new LambdaQueryWrapper<TaskPO>()
                            .eq(TaskPO::getStatus, "PENDING")
            );

            // 进行中任务数（状态=IN_PROGRESS）
            long inProgressCount = taskDao.selectCount(
                    new LambdaQueryWrapper<TaskPO>()
                            .eq(TaskPO::getStatus, "IN_PROGRESS")
            );

            // 已完成任务数（状态=COMPLETED）
            long completedCount = taskDao.selectCount(
                    new LambdaQueryWrapper<TaskPO>()
                            .eq(TaskPO::getStatus, "COMPLETED")
            );

            // 已超期任务数（状态=OVERDUE）
            long overdueCount = taskDao.selectCount(
                    new LambdaQueryWrapper<TaskPO>()
                            .eq(TaskPO::getStatus, "OVERDUE")
            );

            // 今日新增任务数
            LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
            long todayNewCount = taskDao.selectCount(
                    new LambdaQueryWrapper<TaskPO>()
                            .ge(TaskPO::getCreateTime, todayStart)
                            .le(TaskPO::getCreateTime, todayEnd)
            );

            return TaskStatisticsDTO.builder()
                    .totalCount(totalCount)
                    .pendingCount(pendingCount)
                    .inProgressCount(inProgressCount)
                    .completedCount(completedCount)
                    .overdueCount(overdueCount)
                    .todayNewCount(todayNewCount)
                    .build();
        } catch (Exception e) {
            log.error("获取任务统计数据失败", e);
            throw new RuntimeException("获取任务统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取告警统计数据
     */
    public AlertStatisticsDTO getAlertStatistics() {
        try {
            // 告警总数（@TableLogic会自动过滤已删除的记录）
            long totalCount = alertRecordDao.selectCount(new LambdaQueryWrapper<>());

            // 待处理告警数（状态=0-待处理）
            long pendingCount = alertRecordDao.selectCount(
                    new LambdaQueryWrapper<AlertRecordPO>()
                            .eq(AlertRecordPO::getStatus, AlertStatus.PENDING.ordinal())
            );

            // 处理中告警数（状态=1-处理中）
            long inProgressCount = alertRecordDao.selectCount(
                    new LambdaQueryWrapper<AlertRecordPO>()
                            .eq(AlertRecordPO::getStatus, AlertStatus.IN_PROGRESS.ordinal())
            );

            // 已恢复告警数（状态=4-已恢复）
            long recoveredCount = alertRecordDao.selectCount(
                    new LambdaQueryWrapper<AlertRecordPO>()
                            .eq(AlertRecordPO::getStatus, AlertStatus.RECOVERED.ordinal())
            );

            // 紧急告警数（级别=1-紧急）
            long urgentCount = alertRecordDao.selectCount(
                    new LambdaQueryWrapper<AlertRecordPO>()
                            .eq(AlertRecordPO::getAlertLevel, AlertLevel.URGENT.getCode())
            );

            // 重要告警数（级别=2-重要）
            long importantCount = alertRecordDao.selectCount(
                    new LambdaQueryWrapper<AlertRecordPO>()
                            .eq(AlertRecordPO::getAlertLevel, AlertLevel.IMPORTANT.getCode())
            );

            // 今日新增告警数
            LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
            long todayNewCount = alertRecordDao.selectCount(
                    new LambdaQueryWrapper<AlertRecordPO>()
                            .ge(AlertRecordPO::getCreateTime, todayStart)
                            .le(AlertRecordPO::getCreateTime, todayEnd)
            );

            return AlertStatisticsDTO.builder()
                    .totalCount(totalCount)
                    .pendingCount(pendingCount)
                    .inProgressCount(inProgressCount)
                    .recoveredCount(recoveredCount)
                    .urgentCount(urgentCount)
                    .importantCount(importantCount)
                    .todayNewCount(todayNewCount)
                    .build();
        } catch (Exception e) {
            log.error("获取告警统计数据失败", e);
            throw new RuntimeException("获取告警统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取组织统计数据
     */
    public OrganizationStatisticsDTO getOrganizationStatistics() {
        try {
            // 企业总数（@TableLogic会自动过滤已删除的记录）
            long enterpriseCount = enterpriseDao.selectCount(new LambdaQueryWrapper<>());

            // 部门总数（@TableLogic会自动过滤已删除的记录）
            long departmentCount = departmentDao.selectCount(new LambdaQueryWrapper<>());

            // 用户总数（@TableLogic会自动过滤已删除的记录）
            long userCount = userDao.selectCount(new LambdaQueryWrapper<>());

            // 启用用户数（状态=1）
            long activeUserCount = userDao.selectCount(
                    new LambdaQueryWrapper<UserPO>()
                            .eq(UserPO::getStatus, 1)
            );

            return OrganizationStatisticsDTO.builder()
                    .enterpriseCount(enterpriseCount)
                    .departmentCount(departmentCount)
                    .userCount(userCount)
                    .activeUserCount(activeUserCount)
                    .build();
        } catch (Exception e) {
            log.error("获取组织统计数据失败", e);
            throw new RuntimeException("获取组织统计数据失败: " + e.getMessage());
        }
    }

    // ==================== DTO Classes ====================

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SiteStatisticsDTO {
        private Long totalCount;
        private Long wastewaterCount;
        private Long rainwaterCount;
        private Long autoUploadCount;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class DeviceStatisticsDTO {
        private Long totalCount;
        private Long onlineCount;
        private Long offlineCount;
        private Long faultCount;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TaskStatisticsDTO {
        private Long totalCount;
        private Long pendingCount;
        private Long inProgressCount;
        private Long completedCount;
        private Long overdueCount;
        private Long todayNewCount;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AlertStatisticsDTO {
        private Long totalCount;
        private Long pendingCount;
        private Long inProgressCount;
        private Long recoveredCount;
        private Long urgentCount;
        private Long importantCount;
        private Long todayNewCount;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class OrganizationStatisticsDTO {
        private Long enterpriseCount;
        private Long departmentCount;
        private Long userCount;
        private Long activeUserCount;
    }
}
