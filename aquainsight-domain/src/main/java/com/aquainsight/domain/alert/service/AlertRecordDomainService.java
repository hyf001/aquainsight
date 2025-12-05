package com.aquainsight.domain.alert.service;

import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.repository.AlertRecordRepository;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertRuleType;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.domain.alert.types.NotifyStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 告警记录领域服务
 */
@Service
@RequiredArgsConstructor
public class AlertRecordDomainService {

    private final AlertRecordRepository alertRecordRepository;

    /**
     * 创建告警记录
     */
    public AlertRecord createAlertRecord(AlertRule rule, AlertTargetType targetType,
                                        Integer targetId, String targetName,
                                        String alertMessage, String alertData,
                                        Integer jobInstanceId, boolean isSelfTask) {
        // 验证必填字段
        if (rule == null) {
            throw new IllegalArgumentException("告警规则不能为空");
        }
        if (targetType == null) {
            throw new IllegalArgumentException("告警目标类型不能为空");
        }
        if (alertMessage == null || alertMessage.trim().isEmpty()) {
            throw new IllegalArgumentException("告警消息不能为空");
        }

        // 生成告警编码
        String alertCode = generateAlertCode(rule.getRuleType(), targetType);

        AlertRecord record = AlertRecord.builder()
                .alertCode(alertCode)
                .ruleId(rule.getId())
                .ruleName(rule.getRuleName())
                .ruleType(rule.getRuleType())
                .targetType(targetType)
                .targetId(targetId)
                .targetName(targetName)
                .alertLevel(rule.getAlertLevel())
                .alertMessage(alertMessage)
                .alertData(alertData)
                .jobInstanceId(jobInstanceId)
                .isSelfTask(isSelfTask ? 1 : 0)
                .status(AlertStatus.PENDING)
                .notifyStatus(NotifyStatus.PENDING)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return alertRecordRepository.save(record);
    }

    /**
     * 开始处理告警
     */
    public AlertRecord startProcess(Long recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.startProcess();
        return alertRecordRepository.update(record);
    }

    /**
     * 解决告警
     */
    public AlertRecord resolveAlert(Long recordId, String remark) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.resolve(remark);
        return alertRecordRepository.update(record);
    }

    /**
     * 忽略告警
     */
    public AlertRecord ignoreAlert(Long recordId, String remark) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.ignore(remark);
        return alertRecordRepository.update(record);
    }

    /**
     * 标记告警已恢复
     */
    public AlertRecord recoverAlert(Long recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.recover();
        return alertRecordRepository.update(record);
    }

    /**
     * 更新通知状态为成功
     */
    public AlertRecord markNotifySuccess(Long recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.notifySuccess();
        return alertRecordRepository.update(record);
    }

    /**
     * 更新通知状态为失败
     */
    public AlertRecord markNotifyFailed(Long recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.notifyFailed();
        return alertRecordRepository.update(record);
    }

    /**
     * 关联任务实例
     */
    public AlertRecord associateJobInstance(Long recordId, Integer jobInstanceId, boolean isSelfTask) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.associateJobInstance(jobInstanceId, isSelfTask);
        return alertRecordRepository.update(record);
    }

    /**
     * 更新备注
     */
    public AlertRecord updateRemark(Long recordId, String remark) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.updateRemark(remark);
        return alertRecordRepository.update(record);
    }

    /**
     * 根据ID获取告警记录
     */
    public AlertRecord getRecordById(Long recordId) {
        return alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));
    }

    /**
     * 根据告警编码获取告警记录
     */
    public AlertRecord getRecordByAlertCode(String alertCode) {
        return alertRecordRepository.findByAlertCode(alertCode)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));
    }

    /**
     * 获取所有告警记录
     */
    public List<AlertRecord> getAllRecords() {
        return alertRecordRepository.findAll();
    }

    /**
     * 根据状态获取告警记录
     */
    public List<AlertRecord> getRecordsByStatus(AlertStatus status) {
        return alertRecordRepository.findByStatus(status);
    }

    /**
     * 根据规则ID获取告警记录
     */
    public List<AlertRecord> getRecordsByRuleId(Integer ruleId) {
        return alertRecordRepository.findByRuleId(ruleId);
    }

    /**
     * 根据目标获取告警记录
     */
    public List<AlertRecord> getRecordsByTarget(AlertTargetType targetType, Integer targetId) {
        return alertRecordRepository.findByTarget(targetType, targetId);
    }

    /**
     * 获取待处理的紧急告警
     */
    public List<AlertRecord> getPendingUrgentAlerts() {
        return alertRecordRepository.findPendingUrgentAlerts();
    }

    /**
     * 获取指定时间范围内的告警记录
     */
    public List<AlertRecord> getRecordsByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return alertRecordRepository.findByTimeRange(startTime, endTime);
    }

    /**
     * 检查规则在指定时间范围内是否已产生告警（用于静默期判断）
     */
    public AlertRecord findLatestAlertInTimeRange(Integer ruleId, LocalDateTime startTime, LocalDateTime endTime) {
        return alertRecordRepository.findLatestByRuleIdAndTimeRange(ruleId, startTime, endTime)
                .orElse(null);
    }

    /**
     * 统计指定状态的告警数量
     */
    public long countByStatus(AlertStatus status) {
        return alertRecordRepository.countByStatus(status);
    }

    /**
     * 统计指定级别的告警数量
     */
    public long countByAlertLevel(AlertLevel alertLevel) {
        return alertRecordRepository.countByAlertLevel(alertLevel);
    }

    /**
     * 生成告警编码
     * 格式: ALERT-{规则类型}-{目标类型}-{时间戳}
     */
    private String generateAlertCode(AlertRuleType ruleType, AlertTargetType targetType) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        return String.format("ALERT-%s-%s-%s",
                ruleType.getCode().toUpperCase(),
                targetType.getCode().toUpperCase(),
                timestamp);
    }

    /**
     * 批量处理告警恢复
     * 用于系统自动检测到告警条件恢复时调用
     */
    public List<AlertRecord> batchRecoverAlerts(List<Long> recordIds) {
        return recordIds.stream()
                .map(recordId -> {
                    try {
                        return recoverAlert(recordId);
                    } catch (Exception e) {
                        // 记录日志但继续处理其他记录
                        return null;
                    }
                })
                .filter(record -> record != null)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 删除告警记录
     */
    public void deleteRecord(Long recordId) {
        // 验证告警记录存在
        alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        alertRecordRepository.deleteById(recordId);
    }
}
