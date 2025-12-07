package com.aquainsight.application.event;

import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.event.AlertCreatedEvent;
import com.aquainsight.domain.alert.service.AlertNotifyLogDomainService;
import com.aquainsight.domain.alert.service.AlertRecordDomainService;
import com.aquainsight.domain.alert.types.NotifyType;
import com.aquainsight.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 告警生成事件处理器
 * 负责发送告警通知并记录通知日志
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AlertCreatedEventHandler {

    private final AlertNotifyLogDomainService alertNotifyLogDomainService;
    private final AlertRecordDomainService alertRecordDomainService;

    // TODO: 注入通知服务（短信、邮件、钉钉等）
    // private final AlertNotificationService notificationService;

    /**
     * 处理告警生成事件
     * 异步发送告警通知并记录通知日志
     */
    @Async
    @EventListener
    public void handleAlertCreated(AlertCreatedEvent event) {
        AlertRecord alertRecord = event.getAlertRecord();

        log.info("收到告警生成事件，告警ID: {}, 级别: {}, 目标: {}",
                alertRecord.getId(),
                alertRecord.getAlertLevel().getDescription(),
                alertRecord.getTargetName());

        try {
            // 1. 获取告警接收人
            List<User> recipients = alertRecordDomainService.getAlertRecipients(alertRecord);

            if (recipients == null || recipients.isEmpty()) {
                log.warn("告警ID: {} 没有配置接收人，跳过通知发送", alertRecord.getId());
                return;
            }

            // 2. 获取通知方式
            List<NotifyType> notifyTypes = alertRecordDomainService.getNotifyTypes(alertRecord);

            if (notifyTypes == null || notifyTypes.isEmpty()) {
                log.warn("告警ID: {} 没有配置通知方式，跳过通知发送", alertRecord.getId());
                return;
            }

            // 3. 获取格式化后的告警消息
            String alertMessage = alertRecordDomainService.getFormattedAlertMessage(alertRecord);

            // 4. 为每个通知方式和每个接收人创建通知日志并发送
            for (NotifyType notifyType : notifyTypes) {
                for (User user : recipients) {
                    // 根据通知类型获取通知目标（手机号/邮箱/用户ID等）
                    String notifyTarget = user.getNotifyTargetByType(notifyType.getCode());

                    if (notifyTarget == null || notifyTarget.trim().isEmpty()) {
                        log.warn("接收人 {} 没有配置 {} 通知目标，跳过",
                                user.getName(), notifyType.getDescription());
                        continue;
                    }

                    // 创建通知日志
                    AlertNotifyLog notifyLog = alertNotifyLogDomainService.createNotifyLog(
                            alertRecord.getId(),
                            notifyType,
                            notifyTarget,
                            user.getId(),
                            user.getName(),
                            alertMessage
                    );

                    // 发送通知
                    boolean sent = sendNotification(notifyLog, alertRecord);

                    // 更新通知日志状态
                    if (sent) {
                        alertNotifyLogDomainService.markSuccess(notifyLog.getId());
                        log.info("告警通知发送成功，告警ID: {}, 通知方式: {}, 接收人: {}",
                                alertRecord.getId(), notifyType.getDescription(), user.getName());
                    } else {
                        alertNotifyLogDomainService.markFailed(notifyLog.getId(), "发送失败");
                        log.warn("告警通知发送失败，告警ID: {}, 通知方式: {}, 接收人: {}",
                                alertRecord.getId(), notifyType.getDescription(), user.getName());
                    }
                }
            }

            // 5. 更新告警记录的通知状态
            if (alertNotifyLogDomainService.isAllNotifySuccess(alertRecord.getId())) {
                alertRecordDomainService.markNotifySuccess(alertRecord.getId());
            } else if (alertNotifyLogDomainService.hasNotifyFailed(alertRecord.getId())) {
                alertRecordDomainService.markNotifyFailed(alertRecord.getId());
            }

        } catch (Exception e) {
            log.error("处理告警生成事件失败，告警ID: {}", alertRecord.getId(), e);
            alertRecordDomainService.markNotifyFailed(alertRecord.getId());
        }
    }

    /**
     * 发送通知
     * TODO: 集成实际的通知服务
     */
    private boolean sendNotification(AlertNotifyLog notifyLog, AlertRecord alertRecord) {
        try {
            // TODO: 根据通知类型调用不同的通知服务
            // if (notifyLog.isSms()) {
            //     return smsNotificationService.send(notifyLog.getNotifyTarget(), notifyLog.getNotifyContent());
            // } else if (notifyLog.isEmail()) {
            //     return emailNotificationService.send(notifyLog.getNotifyTarget(), notifyLog.getNotifyContent());
            // } else if (notifyLog.isPush()) {
            //     return pushNotificationService.send(notifyLog.getNotifyTarget(), notifyLog.getNotifyContent());
            // } else if (notifyLog.isWechat()) {
            //     return wechatNotificationService.send(notifyLog.getNotifyTarget(), notifyLog.getNotifyContent());
            // }

            // 模拟发送成功
            log.info("【模拟】发送{}通知到: {}, 内容: {}",
                    notifyLog.getNotifyType().getDescription(),
                    notifyLog.getNotifyTarget(),
                    notifyLog.getNotifyContent());
            return true;

        } catch (Exception e) {
            log.error("发送通知失败", e);
            return false;
        }
    }
}
