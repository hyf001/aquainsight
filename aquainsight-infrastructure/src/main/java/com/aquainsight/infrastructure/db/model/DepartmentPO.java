package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 部门持久化对象
 *
 * @author aquainsight
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("department")
public class DepartmentPO {

    /**
     * 部门ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 部门名称
     */
    private String name;
    
    /**
     * 父部门ID
     */
    private Integer parentId;

    /**
     * 排序号
     */
    private Integer sort;

    /**
     * 负责人ID
     */
    private Integer leaderId;

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

    /**
     * 是否删除 (0-未删除, 1-已删除)
     */
    @TableLogic
    private Integer deleted;
}
