package com.aquainsight.domain.alert.repository;

import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 告警记录仓储接口
 */
public interface AlertRecordRepository {

    /**
     * 保存告警记录
     */
    AlertRecord save(AlertRecord alertRecord);

    /**
     * 根据ID查找告警记录
     */
    Optional<AlertRecord> findById(Long id);

    /**
     * 根据告警编码查找告警记录
     */
    Optional<AlertRecord> findByAlertCode(String alertCode);

    /**
     * 查找所有告警记录
     */
    List<AlertRecord> findAll();

    /**
     * 根据状态查找告警记录
     */
    List<AlertRecord> findByStatus(AlertStatus status);

    /**
     * 根据规则ID查找告警记录
     */
    List<AlertRecord> findByRuleId(Integer ruleId);

    /**
     * 根据目标类型和目标ID查找告警记录
     */
    List<AlertRecord> findByTarget(AlertTargetType targetType, Integer targetId);

    /**
     * 根据告警级别查找告警记录
     */
    List<AlertRecord> findByAlertLevel(AlertLevel alertLevel);

    /**
     * 根据任务实例ID查找告警记录
     */
    List<AlertRecord> findByJobInstanceId(Integer jobInstanceId);

    /**
     * 更新告警记录
     */
    AlertRecord update(AlertRecord alertRecord);

    /**
     * 根据ID删除告警记录
     */
    boolean deleteById(Long id);

    /**
     * 分页查询告警记录
     */
    IPage<AlertRecord> findPage(Integer pageNum, Integer pageSize, AlertStatus status,
                                 AlertLevel alertLevel, AlertTargetType targetType,
                                 LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 查找指定规则在指定时间范围内的最新告警记录
     */
    Optional<AlertRecord> findLatestByRuleIdAndTimeRange(Integer ruleId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 统计指定状态的告警数量
     */
    long countByStatus(AlertStatus status);

    /**
     * 统计指定级别的告警数量
     */
    long countByAlertLevel(AlertLevel alertLevel);

    /**
     * 查找待处理的紧急告警
     */
    List<AlertRecord> findPendingUrgentAlerts();

    /**
     * 查找指定时间范围内的告警记录
     */
    List<AlertRecord> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime);
}
