package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 方案项目持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("scheme_item")
public class SchemeItemPO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer schemeId;

    private String name;

    /**
     * 说明
     */
    private String description;

    private Integer jobCategoryId;

    /**
     * 关联的作业类别对象（用于关联查询）
     */
    @TableField(exist = false)
    private JobCategoryPO jobCategory;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
