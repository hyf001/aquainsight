package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 告警通知日志持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("alert_notify_log")
public class AlertNotifyLogPO {

    /**
     * 通知日志ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 关联的告警记录ID
     */
    private Integer alertRecordId;

    /**
     * 通知方式(SMS,EMAIL,WECHAT等)
     */
    private String notifyType;

    /**
     * 接收人
     */
    private String receiver;

    /**
     * 通知内容
     */
    private String content;

    /**
     * 通知状态(SUCCESS-成功,FAILED-失败)
     */
    private String status;

    /**
     * 失败原因
     */
    private String failureReason;

    /**
     * 重试次数
     */
    private Integer retryCount;

    /**
     * 通知时间
     */
    private LocalDateTime notifyTime;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
