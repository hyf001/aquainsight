package com.aquainsight.domain.alert.entity;

import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertRuleType;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.domain.alert.types.NotifyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * 告警记录实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRecord {

    /**
     * 告警记录ID
     */
    private Long id;

    /**
     * 告警编码(唯一标识)
     */
    private String alertCode;

    /**
     * 关联的规则ID
     */
    private Integer ruleId;

    /**
     * 规则名称(冗余字段)
     */
    private String ruleName;

    /**
     * 规则类型(冗余字段)
     */
    private AlertRuleType ruleType;

    /**
     * 告警目标类型(site-站点,device-设备,factor-因子,task-任务)
     */
    private AlertTargetType targetType;

    /**
     * 告警目标ID
     */
    private Integer targetId;

    /**
     * 告警目标名称
     */
    private String targetName;

    /**
     * 告警级别
     */
    private AlertLevel alertLevel;

    /**
     * 告警消息内容
     */
    private String alertMessage;

    /**
     * 告警相关数据(JSON格式,如超标数值、设备状态等)
     */
    private String alertData;

    /**
     * 关联的任务实例ID
     */
    private Integer jobInstanceId;

    /**
     * 是否关联自身任务(0-关联新创建任务,1-关联触发告警的任务本身)
     */
    private Integer isSelfTask;

    /**
     * 告警状态
     */
    private AlertStatus status;

    /**
     * 通知状态
     */
    private NotifyStatus notifyStatus;

    /**
     * 通知时间
     */
    private LocalDateTime notifyTime;

    /**
     * 恢复正常时间
     */
    private LocalDateTime recoverTime;

    /**
     * 持续时长(分钟)
     */
    private Integer duration;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 开始处理
     */
    public void startProcess() {
        if (this.status == AlertStatus.PENDING) {
            this.status = AlertStatus.IN_PROGRESS;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理状态的告警才能开始处理");
        }
    }

    /**
     * 标记为已处理
     */
    public void resolve(String remark) {
        if (this.status == AlertStatus.IN_PROGRESS || this.status == AlertStatus.PENDING) {
            this.status = AlertStatus.RESOLVED;
            this.remark = remark;
            this.updateTime = LocalDateTime.now();
            this.calculateDuration();
        } else {
            throw new IllegalStateException("只有待处理或处理中的告警才能标记为已处理");
        }
    }

    /**
     * 忽略告警
     */
    public void ignore(String remark) {
        if (this.status == AlertStatus.PENDING || this.status == AlertStatus.IN_PROGRESS) {
            this.status = AlertStatus.IGNORED;
            this.remark = remark;
            this.updateTime = LocalDateTime.now();
            this.calculateDuration();
        } else {
            throw new IllegalStateException("只有待处理或处理中的告警才能忽略");
        }
    }

    /**
     * 标记为已恢复
     */
    public void recover() {
        if (this.status != AlertStatus.RESOLVED && this.status != AlertStatus.IGNORED) {
            this.status = AlertStatus.RECOVERED;
            this.recoverTime = LocalDateTime.now();
            this.updateTime = LocalDateTime.now();
            this.calculateDuration();
        } else {
            throw new IllegalStateException("已处理或已忽略的告警不能标记为已恢复");
        }
    }

    /**
     * 更新通知状态为成功
     */
    public void notifySuccess() {
        this.notifyStatus = NotifyStatus.SUCCESS;
        this.notifyTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 更新通知状态为失败
     */
    public void notifyFailed() {
        this.notifyStatus = NotifyStatus.FAILED;
        this.notifyTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 计算持续时长(分钟)
     */
    private void calculateDuration() {
        if (this.createTime != null) {
            LocalDateTime endTime = this.recoverTime != null ? this.recoverTime : LocalDateTime.now();
            this.duration = (int) Duration.between(this.createTime, endTime).toMinutes();
        }
    }

    /**
     * 是否待处理
     */
    public boolean isPending() {
        return AlertStatus.PENDING.equals(this.status);
    }

    /**
     * 是否处理中
     */
    public boolean isInProgress() {
        return AlertStatus.IN_PROGRESS.equals(this.status);
    }

    /**
     * 是否已处理
     */
    public boolean isResolved() {
        return AlertStatus.RESOLVED.equals(this.status);
    }

    /**
     * 是否已恢复
     */
    public boolean isRecovered() {
        return AlertStatus.RECOVERED.equals(this.status);
    }

    /**
     * 是否已忽略
     */
    public boolean isIgnored() {
        return AlertStatus.IGNORED.equals(this.status);
    }

    /**
     * 是否已通知
     */
    public boolean isNotified() {
        return NotifyStatus.SUCCESS.equals(this.notifyStatus);
    }

    /**
     * 是否通知失败
     */
    public boolean isNotifyFailed() {
        return NotifyStatus.FAILED.equals(this.notifyStatus);
    }

    /**
     * 是否为紧急告警
     */
    public boolean isUrgent() {
        return AlertLevel.URGENT.equals(this.alertLevel);
    }

    /**
     * 是否为重要告警
     */
    public boolean isImportant() {
        return AlertLevel.IMPORTANT.equals(this.alertLevel);
    }

    /**
     * 是否关联任务
     */
    public boolean hasJobInstance() {
        return this.jobInstanceId != null && this.jobInstanceId > 0;
    }

    /**
     * 是否关联自身任务
     */
    public boolean isSelfTaskRelated() {
        return Integer.valueOf(1).equals(this.isSelfTask);
    }

    /**
     * 更新备注
     */
    public void updateRemark(String remark) {
        this.remark = remark;
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 关联任务实例
     */
    public void associateJobInstance(Integer jobInstanceId, boolean isSelfTask) {
        this.jobInstanceId = jobInstanceId;
        this.isSelfTask = isSelfTask ? 1 : 0;
        this.updateTime = LocalDateTime.now();
    }
}
