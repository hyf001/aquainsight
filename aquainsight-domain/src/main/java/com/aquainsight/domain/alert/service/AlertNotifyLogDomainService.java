package com.aquainsight.domain.alert.service;

import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.repository.AlertNotifyLogRepository;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 告警通知日志领域服务
 */
@Service
@RequiredArgsConstructor
public class AlertNotifyLogDomainService {

    private final AlertNotifyLogRepository alertNotifyLogRepository;

    /**
     * 创建通知日志
     */
    public AlertNotifyLog createNotifyLog(Integer alertRecordId, NotifyType notifyType,
                                         String notifyTarget, Integer notifyUserId,
                                         String notifyUserName, String notifyContent) {
        // 验证必填字段
        if (alertRecordId == null) {
            throw new IllegalArgumentException("告警记录ID不能为空");
        }
        if (notifyType == null) {
            throw new IllegalArgumentException("通知方式不能为空");
        }
        if (notifyTarget == null || notifyTarget.trim().isEmpty()) {
            throw new IllegalArgumentException("通知目标不能为空");
        }

        AlertNotifyLog log = AlertNotifyLog.builder()
                .alertRecordId(alertRecordId)
                .notifyType(notifyType)
                .notifyTarget(notifyTarget)
                .notifyUserId(notifyUserId)
                .notifyUserName(notifyUserName)
                .notifyContent(notifyContent)
                .notifyStatus(NotifyStatus.PENDING)
                .retryCount(0)
                .createTime(LocalDateTime.now())
                .build();

        return alertNotifyLogRepository.save(log);
    }

    /**
     * 批量创建通知日志
     */
    public List<AlertNotifyLog> batchCreateNotifyLogs(AlertRecord alertRecord,
                                                      List<NotifyType> notifyTypes,
                                                      List<String> notifyTargets,
                                                      List<Integer> notifyUserIds,
                                                      List<String> notifyUserNames) {
        if (alertRecord == null) {
            throw new IllegalArgumentException("告警记录不能为空");
        }
        if (notifyTypes == null || notifyTypes.isEmpty()) {
            throw new IllegalArgumentException("通知方式列表不能为空");
        }
        if (notifyTargets == null || notifyTargets.isEmpty()) {
            throw new IllegalArgumentException("通知目标列表不能为空");
        }

        List<AlertNotifyLog> logs = new ArrayList<>();

        // 为每个通知目标创建日志
        for (int i = 0; i < notifyTargets.size(); i++) {
            NotifyType notifyType = i < notifyTypes.size() ? notifyTypes.get(i) : notifyTypes.get(0);
            String notifyTarget = notifyTargets.get(i);
            Integer notifyUserId = i < notifyUserIds.size() ? notifyUserIds.get(i) : null;
            String notifyUserName = i < notifyUserNames.size() ? notifyUserNames.get(i) : null;

            AlertNotifyLog log = AlertNotifyLog.builder()
                    .alertRecordId(alertRecord.getId())
                    .notifyType(notifyType)
                    .notifyTarget(notifyTarget)
                    .notifyUserId(notifyUserId)
                    .notifyUserName(notifyUserName)
                    .notifyContent(alertRecord.getAlertMessage())
                    .notifyStatus(NotifyStatus.PENDING)
                    .retryCount(0)
                    .createTime(LocalDateTime.now())
                    .build();

            logs.add(log);
        }

        return alertNotifyLogRepository.batchSave(logs);
    }

    /**
     * 标记发送成功
     */
    public AlertNotifyLog markSuccess(Integer logId) {
        AlertNotifyLog log = alertNotifyLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("通知日志不存在"));

        log.markSuccess();
        return alertNotifyLogRepository.update(log);
    }

    /**
     * 标记发送失败
     */
    public AlertNotifyLog markFailed(Integer logId, String errorMessage) {
        AlertNotifyLog log = alertNotifyLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("通知日志不存在"));

        log.markFailed(errorMessage);
        return alertNotifyLogRepository.update(log);
    }

    /**
     * 重试发送
     */
    public AlertNotifyLog retry(Integer logId) {
        AlertNotifyLog log = alertNotifyLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("通知日志不存在"));

        if (!log.canRetry()) {
            throw new IllegalStateException("该通知不可重试");
        }

        log.resetToPending();
        return alertNotifyLogRepository.update(log);
    }

    /**
     * 根据ID获取通知日志
     */
    public AlertNotifyLog getLogById(Integer logId) {
        return alertNotifyLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("通知日志不存在"));
    }

    /**
     * 根据告警记录ID获取所有通知日志
     */
    public List<AlertNotifyLog> getLogsByAlertRecordId(Integer alertRecordId) {
        return alertNotifyLogRepository.findByAlertRecordId(alertRecordId);
    }

    /**
     * 获取待发送的通知日志
     */
    public List<AlertNotifyLog> getPendingNotifyLogs() {
        return alertNotifyLogRepository.findPendingNotifyLogs();
    }

    /**
     * 获取发送失败且可重试的通知日志
     */
    public List<AlertNotifyLog> getFailedAndRetryableNotifyLogs() {
        return alertNotifyLogRepository.findFailedAndRetryableNotifyLogs();
    }

    /**
     * 根据通知状态获取通知日志
     */
    public List<AlertNotifyLog> getLogsByStatus(NotifyStatus status) {
        return alertNotifyLogRepository.findByNotifyStatus(status);
    }

    /**
     * 根据通知方式获取通知日志
     */
    public List<AlertNotifyLog> getLogsByNotifyType(NotifyType notifyType) {
        return alertNotifyLogRepository.findByNotifyType(notifyType);
    }

    /**
     * 根据用户ID获取通知日志
     */
    public List<AlertNotifyLog> getLogsByUserId(Integer userId) {
        return alertNotifyLogRepository.findByNotifyUserId(userId);
    }

    /**
     * 统计告警记录的通知成功数量
     */
    public long countSuccessByAlertRecordId(Integer alertRecordId) {
        return alertNotifyLogRepository.countSuccessByAlertRecordId(alertRecordId);
    }

    /**
     * 统计告警记录的通知失败数量
     */
    public long countFailedByAlertRecordId(Integer alertRecordId) {
        return alertNotifyLogRepository.countFailedByAlertRecordId(alertRecordId);
    }

    /**
     * 检查告警记录是否所有通知都已成功
     */
    public boolean isAllNotifySuccess(Integer alertRecordId) {
        List<AlertNotifyLog> logs = alertNotifyLogRepository.findByAlertRecordId(alertRecordId);
        if (logs.isEmpty()) {
            return false;
        }
        return logs.stream().allMatch(AlertNotifyLog::isSuccess);
    }

    /**
     * 检查告警记录是否有通知失败
     */
    public boolean hasNotifyFailed(Integer alertRecordId) {
        List<AlertNotifyLog> logs = alertNotifyLogRepository.findByAlertRecordId(alertRecordId);
        return logs.stream().anyMatch(AlertNotifyLog::isFailed);
    }

    /**
     * 批量重试失败的通知
     */
    public List<AlertNotifyLog> batchRetryFailed() {
        List<AlertNotifyLog> failedLogs = getFailedAndRetryableNotifyLogs();
        List<AlertNotifyLog> retriedLogs = new ArrayList<>();

        for (AlertNotifyLog log : failedLogs) {
            try {
                AlertNotifyLog retriedLog = retry(log.getId());
                retriedLogs.add(retriedLog);
            } catch (Exception e) {
                // 记录日志但继续处理其他记录
                continue;
            }
        }

        return retriedLogs;
    }

    /**
     * 删除通知日志
     */
    public void deleteLog(Integer logId) {
        // 验证通知日志存在
        alertNotifyLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("通知日志不存在"));

        alertNotifyLogRepository.deleteById(logId);
    }

    /**
     * 批量删除告警记录相关的通知日志
     */
    public void deleteLogsByAlertRecordId(Integer alertRecordId) {
        List<AlertNotifyLog> logs = alertNotifyLogRepository.findByAlertRecordId(alertRecordId);
        for (AlertNotifyLog log : logs) {
            alertNotifyLogRepository.deleteById(log.getId());
        }
    }
}
