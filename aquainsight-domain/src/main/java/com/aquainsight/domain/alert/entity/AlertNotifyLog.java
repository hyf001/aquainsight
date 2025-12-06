package com.aquainsight.domain.alert.entity;

import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 告警通知日志实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertNotifyLog {

    /**
     * 通知日志ID
     */
    private Integer id;

    /**
     * 告警记录ID
     */
    private Integer alertRecordId;

    /**
     * 通知方式
     */
    private NotifyType notifyType;

    /**
     * 通知目标(手机号/邮箱/用户ID等)
     */
    private String notifyTarget;

    /**
     * 通知用户ID
     */
    private Integer notifyUserId;

    /**
     * 通知用户姓名
     */
    private String notifyUserName;

    /**
     * 通知内容
     */
    private String notifyContent;

    /**
     * 通知状态
     */
    private NotifyStatus notifyStatus;

    /**
     * 发送时间
     */
    private LocalDateTime sendTime;

    /**
     * 失败原因
     */
    private String errorMessage;

    /**
     * 重试次数
     */
    private Integer retryCount;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 标记发送成功
     */
    public void markSuccess() {
        this.notifyStatus = NotifyStatus.SUCCESS;
        this.sendTime = LocalDateTime.now();
        this.errorMessage = null;
    }

    /**
     * 标记发送失败
     */
    public void markFailed(String errorMessage) {
        this.notifyStatus = NotifyStatus.FAILED;
        this.sendTime = LocalDateTime.now();
        this.errorMessage = errorMessage;
    }

    /**
     * 增加重试次数
     */
    public void incrementRetryCount() {
        if (this.retryCount == null) {
            this.retryCount = 0;
        }
        this.retryCount++;
    }

    /**
     * 是否发送成功
     */
    public boolean isSuccess() {
        return NotifyStatus.SUCCESS.equals(this.notifyStatus);
    }

    /**
     * 是否发送失败
     */
    public boolean isFailed() {
        return NotifyStatus.FAILED.equals(this.notifyStatus);
    }

    /**
     * 是否待发送
     */
    public boolean isPending() {
        return NotifyStatus.PENDING.equals(this.notifyStatus);
    }

    /**
     * 是否可以重试
     */
    public boolean canRetry() {
        return this.isFailed() && (this.retryCount == null || this.retryCount < 3);
    }

    /**
     * 是否为短信通知
     */
    public boolean isSms() {
        return NotifyType.SMS.equals(this.notifyType);
    }

    /**
     * 是否为邮件通知
     */
    public boolean isEmail() {
        return NotifyType.EMAIL.equals(this.notifyType);
    }

    /**
     * 是否为推送通知
     */
    public boolean isPush() {
        return NotifyType.PUSH.equals(this.notifyType);
    }

    /**
     * 是否为微信通知
     */
    public boolean isWechat() {
        return NotifyType.WECHAT.equals(this.notifyType);
    }

    /**
     * 重置为待发送状态(用于重试)
     */
    public void resetToPending() {
        if (this.canRetry()) {
            this.notifyStatus = NotifyStatus.PENDING;
            this.incrementRetryCount();
        } else {
            throw new IllegalStateException("该通知不可重试");
        }
    }
}
