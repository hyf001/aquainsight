package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 步骤执行持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("step")
public class StepPO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 所属任务ID
     */
    private Integer taskId;

    /**
     * 步骤模板ID
     */
    private Integer stepTemplateId;

    /**
     * 步骤名称（快照）
     */
    private String stepName;

    /**
     * 参数填写值列表（JSON格式）
     */
    private String parameters;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
