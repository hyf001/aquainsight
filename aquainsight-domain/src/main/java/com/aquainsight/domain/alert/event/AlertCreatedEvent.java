package com.aquainsight.domain.alert.event;

import com.aquainsight.domain.alert.entity.AlertRecord;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * 告警生成事件
 * 当新的告警被创建时触发
 */
@Getter
public class AlertCreatedEvent extends ApplicationEvent {

    /**
     * 告警记录
     */
    private final AlertRecord alertRecord;

    public AlertCreatedEvent(Object source, AlertRecord alertRecord) {
        super(source);
        this.alertRecord = alertRecord;
    }
}
