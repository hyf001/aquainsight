package com.aquainsight.domain.alert.service;

import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.event.AlertCreatedEvent;
import com.aquainsight.domain.alert.event.AlertRecoveredEvent;
import com.aquainsight.domain.alert.repository.AlertRecordRepository;
import com.aquainsight.domain.alert.repository.AlertRuleRepository;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertRuleType;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.entity.UserDepartment;
import com.aquainsight.domain.user.repository.UserDepartmentRepository;
import com.aquainsight.domain.user.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 告警记录领域服务
 */
@Service
@RequiredArgsConstructor
public class AlertRecordDomainService {

    private final AlertRecordRepository alertRecordRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final AlertRuleRepository alertRuleRepository;
    private final UserRepository userRepository;
    private final SiteRepository siteRepository;
    private final SiteJobInstanceRepository siteJobInstanceRepository;
    private final UserDepartmentRepository userDepartmentRepository;

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

        AlertRecord record = AlertRecord.builder()
                .ruleId(rule.getId())
                .ruleName(rule.getRuleName())
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

        AlertRecord savedRecord = alertRecordRepository.save(record);

        // 发布告警生成事件
        eventPublisher.publishEvent(new AlertCreatedEvent(this, savedRecord));

        return savedRecord;
    }

    /**
     * 开始处理告警
     */
    public AlertRecord startProcess(Integer recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.startProcess();
        return alertRecordRepository.update(record);
    }

    /**
     * 忽略告警
     */
    public AlertRecord ignoreAlert(Integer recordId, String remark) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.ignore(remark);
        return alertRecordRepository.update(record);
    }

    /**
     * 标记告警已恢复
     */
    public AlertRecord recoverAlert(Integer recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.recover();
        AlertRecord updatedRecord = alertRecordRepository.update(record);

        // 发布告警恢复事件
        eventPublisher.publishEvent(new AlertRecoveredEvent(this, updatedRecord));

        return updatedRecord;
    }

    /**
     * 更新通知状态为成功
     */
    public AlertRecord markNotifySuccess(Integer recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.notifySuccess();
        return alertRecordRepository.update(record);
    }

    /**
     * 更新通知状态为失败
     */
    public AlertRecord markNotifyFailed(Integer recordId) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.notifyFailed();
        return alertRecordRepository.update(record);
    }

    /**
     * 关联任务实例
     */
    public AlertRecord associateJobInstance(Integer recordId, Integer jobInstanceId, boolean isSelfTask) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.associateJobInstance(jobInstanceId, isSelfTask);
        return alertRecordRepository.update(record);
    }

    /**
     * 更新备注
     */
    public AlertRecord updateRemark(Integer recordId, String remark) {
        AlertRecord record = alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        record.updateRemark(remark);
        return alertRecordRepository.update(record);
    }

    /**
     * 根据ID获取告警记录
     */
    public AlertRecord getRecordById(Integer recordId) {
        return alertRecordRepository.findById(recordId)
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
     * 批量处理告警恢复
     * 用于系统自动检测到告警条件恢复时调用
     */
    public List<AlertRecord> batchRecoverAlerts(List<Integer> recordIds) {
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
    public void deleteRecord(Integer recordId) {
        // 验证告警记录存在
        alertRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("告警记录不存在"));

        alertRecordRepository.deleteById(recordId);
    }

    /**
     * 获取告警接收人信息
     *
     * @param alertRecord 告警记录
     * @return 接收人用户列表
     */
    public List<User> getAlertRecipients(AlertRecord alertRecord) {
        // 1. 获取告警规则
        AlertRule alertRule = alertRuleRepository.findById(alertRecord.getRuleId())
                .orElse(null);

        if (alertRule == null) {
            return new ArrayList<>();
        }

        List<User> recipients = new ArrayList<>();

        // 2. 优先使用规则中配置的通知人员
        List<Integer> notifyUserIds = alertRule.getNotifyUserIdList();
        if (notifyUserIds != null && !notifyUserIds.isEmpty()) {
            // 根据用户ID获取用户信息
            for (Integer userId : notifyUserIds) {
                try {
                    User user = userRepository.findById(userId).orElse(null);
                    if (user != null) {
                        recipients.add(user);
                    }
                } catch (Exception e) {
                    // 跳过异常用户
                }
            }
            return recipients;
        }

        // 3. 如果规则中没有配置人员，则根据目标类型获取负责人
        AlertTargetType targetType = alertRecord.getTargetType();
        Integer targetId = alertRecord.getTargetId();

        if (AlertTargetType.TASK.equals(targetType)) {
            // 获取任务负责人
            return getTaskRecipients(targetId);
        } else if (AlertTargetType.SITE.equals(targetType)) {
            // 获取站点负责人
            return getSiteRecipients(targetId);
        }

        // 其他类型不做告警
        return new ArrayList<>();
    }

    /**
     * 获取告警通知方式列表
     *
     * @param alertRecord 告警记录
     * @return 通知方式列表
     */
    public List<NotifyType> getNotifyTypes(AlertRecord alertRecord) {
        // 获取告警规则
        AlertRule alertRule = alertRuleRepository.findById(alertRecord.getRuleId())
                .orElse(null);

        if (alertRule == null) {
            // 默认使用短信通知
            List<NotifyType> defaultList = new ArrayList<>();
            defaultList.add(NotifyType.SMS);
            return defaultList;
        }

        // 从规则中获取通知方式
        List<String> notifyTypeCodes = alertRule.getNotifyTypeList();
        if (notifyTypeCodes == null || notifyTypeCodes.isEmpty()) {
            // 默认使用短信通知
            List<NotifyType> defaultList = new ArrayList<>();
            defaultList.add(NotifyType.SMS);
            return defaultList;
        }

        // 转换为 NotifyType 枚举
        return notifyTypeCodes.stream()
                .map(code -> {
                    try {
                        return NotifyType.fromCode(code);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(type -> type != null)
                .collect(Collectors.toList());
    }

    /**
     * 获取告警消息（使用规则模板）
     *
     * @param alertRecord 告警记录
     * @return 格式化后的告警消息
     */
    public String getFormattedAlertMessage(AlertRecord alertRecord) {
        // 获取告警规则
        AlertRule alertRule = alertRuleRepository.findById(alertRecord.getRuleId())
                .orElse(null);

        if (alertRule == null || alertRule.getAlertMessage() == null) {
            // 使用默认格式
            return String.format("【%s告警】目标：%s，消息：%s",
                    alertRecord.getAlertLevel().getDescription(),
                    alertRecord.getTargetName(),
                    alertRecord.getAlertMessage());
        }

        // 使用规则中的消息模板
        // 可以支持占位符替换，例如：{targetName}、{alertMessage} 等
        String template = alertRule.getAlertMessage();
        return template
                .replace("{targetName}", alertRecord.getTargetName() != null ? alertRecord.getTargetName() : "")
                .replace("{alertMessage}", alertRecord.getAlertMessage() != null ? alertRecord.getAlertMessage() : "")
                .replace("{alertLevel}", alertRecord.getAlertLevel().getDescription());
    }

    /**
     * 获取任务负责人
     * 返回任务实例所属 plan 中 department 的所有成员
     */
    private List<User> getTaskRecipients(Integer taskId) {
        List<User> recipients = new ArrayList<>();

        try {
            SiteJobInstance jobInstance = siteJobInstanceRepository.findById(taskId);
            if (jobInstance != null) {
                // 获取任务实例中的部门ID
                Integer departmentId = jobInstance.getDepartmentId();

                if (departmentId != null) {
                    // 获取部门的所有用户关系
                    List<UserDepartment> userDepartments = userDepartmentRepository.findByDepartmentId(departmentId);

                    // 根据用户ID获取用户信息
                    for (UserDepartment userDepartment : userDepartments) {
                        try {
                            User user = userRepository.findById(userDepartment.getUserId()).orElse(null);
                            if (user != null) {
                                recipients.add(user);
                            }
                        } catch (Exception e) {
                            // 跳过异常用户
                        }
                    }
                }
            }
        } catch (Exception e) {
            // 记录日志但不抛出异常
        }

        return recipients;
    }

    /**
     * 获取站点负责人
     * TODO: 需要在Site实体中添加负责人字段
     */
    private List<User> getSiteRecipients(Integer siteId) {
        List<User> recipients = new ArrayList<>();

        try {
            Site site = siteRepository.findById(siteId).orElse(null);
            if (site != null) {
                // TODO: 从Site中获取负责人信息
                // 目前Site实体中没有负责人字段，需要添加
                // Integer principalUserId = site.getPrincipalUserId();
                // if (principalUserId != null) {
                //     User user = userRepository.findById(principalUserId).orElse(null);
                //     if (user != null) {
                //         recipients.add(user);
                //     }
                // }
            }
        } catch (Exception e) {
            // 记录日志但不抛出异常
        }

        return recipients;
    }
}
