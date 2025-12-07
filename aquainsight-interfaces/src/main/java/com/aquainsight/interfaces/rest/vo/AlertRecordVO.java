package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 告警记录视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRecordVO {

    private Integer id;

    private Integer ruleId;

    private String ruleName;

    private String ruleType;

    private String targetType;

    private Integer targetId;

    private String targetName;

    private String alertLevel;

    private String alertMessage;

    private String alertData;

    private String status;

    private String notifyStatus;

    private LocalDateTime notifyTime;

    private LocalDateTime recoverTime;

    private Integer duration;

    private String remark;

    private String handler;

    private Integer isSelfTask;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
