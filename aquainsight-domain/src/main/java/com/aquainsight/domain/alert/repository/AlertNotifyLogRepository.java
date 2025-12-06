package com.aquainsight.domain.alert.repository;

import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 告警通知日志仓储接口
 */
public interface AlertNotifyLogRepository {

    /**
     * 保存通知日志
     */
    AlertNotifyLog save(AlertNotifyLog notifyLog);

    /**
     * 根据ID查找通知日志
     */
    Optional<AlertNotifyLog> findById(Integer id);

    /**
     * 根据告警记录ID查找所有通知日志
     */
    List<AlertNotifyLog> findByAlertRecordId(Integer alertRecordId);

    /**
     * 根据通知状态查找通知日志
     */
    List<AlertNotifyLog> findByNotifyStatus(NotifyStatus notifyStatus);

    /**
     * 根据通知方式查找通知日志
     */
    List<AlertNotifyLog> findByNotifyType(NotifyType notifyType);

    /**
     * 根据用户ID查找通知日志
     */
    List<AlertNotifyLog> findByNotifyUserId(Integer userId);

    /**
     * 查找待发送的通知日志
     */
    List<AlertNotifyLog> findPendingNotifyLogs();

    /**
     * 查找发送失败且可重试的通知日志
     */
    List<AlertNotifyLog> findFailedAndRetryableNotifyLogs();

    /**
     * 更新通知日志
     */
    AlertNotifyLog update(AlertNotifyLog notifyLog);

    /**
     * 根据ID删除通知日志
     */
    boolean deleteById(Integer id);

    /**
     * 分页查询通知日志
     */
    IPage<AlertNotifyLog> findPage(Integer pageNum, Integer pageSize, Integer alertRecordId,
                                    NotifyStatus notifyStatus, NotifyType notifyType,
                                    LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 统计指定告警记录的通知成功数量
     */
    long countSuccessByAlertRecordId(Integer alertRecordId);

    /**
     * 统计指定告警记录的通知失败数量
     */
    long countFailedByAlertRecordId(Integer alertRecordId);

    /**
     * 批量保存通知日志
     */
    List<AlertNotifyLog> batchSave(List<AlertNotifyLog> notifyLogs);
}
