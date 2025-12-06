package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 告警通知日志视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertNotifyLogVO {

    private Integer id;

    private Integer alertRecordId;

    private String notifyType;

    private String notifyTarget;

    private Integer notifyUserId;

    private String notifyUserName;

    private String notifyContent;

    private String notifyStatus;

    private LocalDateTime sendTime;

    private String errorMessage;

    private Integer retryCount;

    private LocalDateTime createTime;
}
