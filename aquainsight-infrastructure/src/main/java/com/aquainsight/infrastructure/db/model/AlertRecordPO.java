package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 告警记录持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("alert_record")
public class AlertRecordPO {

    /**
     * 告警记录ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

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
    private String ruleType;

    /**
     * 告警目标类型(site-站点,device-设备,task-任务)
     */
    private String targetType;

    /**
     * 告警目标ID
     */
    private Integer targetId;

    /**
     * 告警目标名称
     */
    private String targetName;

    /**
     * 告警级别(1-紧急, 2-重要, 3-一般, 4-提示)
     */
    private Integer alertLevel;

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
     * 告警状态(0-待处理,1-处理中,2-已处理,3-已忽略,4-已恢复)
     */
    private Integer status;

    /**
     * 通知状态(0-未通知,1-已通知,2-通知失败)
     */
    private Integer notifyStatus;

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
     * 是否删除(0-未删除,1-已删除)
     */
    @TableLogic
    private Integer deleted;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
