package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 步骤项目持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("task_template_item")
public class TaskTemplateItemPO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer taskTemplateId;

    private String name;

    /**
     * 说明
     */
    private String description;

    private Integer stepTemplateId;

    /**
     * 关联的步骤定义对象（用于关联查询）
     */
    @TableField(exist = false)
    private StepTemplatePO stepTemplate;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
