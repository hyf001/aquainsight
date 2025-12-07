package com.aquainsight.domain.alert.event;

import com.aquainsight.domain.alert.entity.AlertRecord;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * 告警恢复事件
 * 当告警条件恢复正常时触发
 */
@Getter
public class AlertRecoveredEvent extends ApplicationEvent {

    /**
     * 告警记录
     */
    private final AlertRecord alertRecord;

    public AlertRecoveredEvent(Object source, AlertRecord alertRecord) {
        super(source);
        this.alertRecord = alertRecord;
    }
}
