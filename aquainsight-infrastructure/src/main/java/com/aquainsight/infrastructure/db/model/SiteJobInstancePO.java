package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 站点任务实例持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("site_job_instance")
public class SiteJobInstancePO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 站点ID (直接存储,不依赖任务计划)
     */
    private Integer siteId;

    /**
     * 站点 (关联对象,用于查询时填充)
     */
    @TableField(exist = false)
    private SitePO site;

    /**
     * 方案ID (直接存储,不依赖任务计划)
     */
    private Integer schemeId;

    /**
     * 方案 (关联对象,用于查询时填充)
     */
    @TableField(exist = false)
    private SchemePO scheme;

    /**
     * 部门ID (直接存储,不依赖任务计划)
     */
    private Integer departmentId;

    /**
     * 部门 (关联对象,用于查询时填充)
     */
    @TableField(exist = false)
    private DepartmentPO department;

    /**
     * 任务计划ID (可选,如果是从计划生成的任务则有值)
     */
    private Integer siteJobPlanId;

    /**
     * 任务计划 (关联对象,用于查询时填充)
     */
    @TableField(exist = false)
    private SiteJobPlanPO siteJobPlan;

    /**
     * 任务派发时间
     */
    private LocalDateTime triggerTime;

    /**
     * 任务开始时间
     */
    private LocalDateTime startTime;

    /**
     * 任务结束时间
     */
    private LocalDateTime endTime;

    /**
     * 任务状态
     */
    private String status;

    /**
     * 任务过期时间
     */
    private LocalDateTime expiredTime;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 任务处理人
     */
    private String operator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
