package com.aquainsight.application.event;

import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.event.AlertRecoveredEvent;
import com.aquainsight.domain.alert.service.AlertNotifyLogDomainService;
import com.aquainsight.domain.alert.types.NotifyType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 告警恢复事件处理器
 * 负责发送告警恢复通知并记录通知日志
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AlertRecoveredEventHandler {

    private final AlertNotifyLogDomainService alertNotifyLogDomainService;

    // TODO: 注入通知服务（短信、邮件、钉钉等）
    // private final AlertNotificationService notificationService;

    /**
     * 处理告警恢复事件
     * 异步发送恢复通知并记录通知日志
     */
    @Async
    @EventListener
    public void handleAlertRecovered(AlertRecoveredEvent event) {
        AlertRecord alertRecord = event.getAlertRecord();

        log.info("收到告警恢复事件，告警ID: {}, 目标: {}, 持续时长: {}分钟",
                alertRecord.getId(),
                alertRecord.getTargetName(),
                alertRecord.getDuration());

        try {
            // 1. 获取原始告警的通知记录，发送给相同的接收人
            List<AlertNotifyLog> originalNotifyLogs = alertNotifyLogDomainService.getLogsByAlertRecordId(alertRecord.getId());

            if (originalNotifyLogs.isEmpty()) {
                log.warn("告警ID: {} 没有找到原始通知记录，跳过恢复通知发送", alertRecord.getId());
                return;
            }

            // 2. 为每个原始接收人发送恢复通知
            for (AlertNotifyLog originalLog : originalNotifyLogs) {
                // 只向成功接收过告警的人发送恢复通知
                if (!originalLog.isSuccess()) {
                    continue;
                }

                // 创建恢复通知日志
                AlertNotifyLog recoveryLog = alertNotifyLogDomainService.createNotifyLog(
                        alertRecord.getId(),
                        originalLog.getNotifyType(),
                        originalLog.getNotifyTarget(),
                        originalLog.getNotifyUserId(),
                        originalLog.getNotifyUserName(),
                        buildRecoveryMessage(alertRecord)
                );

                // 发送恢复通知
                boolean sent = sendRecoveryNotification(recoveryLog, alertRecord);

                // 更新通知日志状态
                if (sent) {
                    alertNotifyLogDomainService.markSuccess(recoveryLog.getId());
                    log.info("告警恢复通知发送成功，告警ID: {}, 接收人: {}",
                            alertRecord.getId(), recoveryLog.getNotifyTarget());
                } else {
                    alertNotifyLogDomainService.markFailed(recoveryLog.getId(), "发送失败");
                    log.warn("告警恢复通知发送失败，告警ID: {}, 接收人: {}",
                            alertRecord.getId(), recoveryLog.getNotifyTarget());
                }
            }

        } catch (Exception e) {
            log.error("处理告警恢复事件失败，告警ID: {}", alertRecord.getId(), e);
        }
    }

    /**
     * 发送恢复通知
     * TODO: 集成实际的通知服务
     */
    private boolean sendRecoveryNotification(AlertNotifyLog notifyLog, AlertRecord alertRecord) {
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
            log.info("【模拟】发送{}恢复通知到: {}, 内容: {}",
                    notifyLog.getNotifyType().getDescription(),
                    notifyLog.getNotifyTarget(),
                    notifyLog.getNotifyContent());
            return true;

        } catch (Exception e) {
            log.error("发送恢复通知失败", e);
            return false;
        }
    }

    /**
     * 构建恢复通知消息
     */
    private String buildRecoveryMessage(AlertRecord alertRecord) {
        return String.format("【告警已恢复】目标：%s，持续时长：%d分钟",
                alertRecord.getTargetName(),
                alertRecord.getDuration() != null ? alertRecord.getDuration() : 0);
    }
}
