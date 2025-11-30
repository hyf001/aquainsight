package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 站点任务计划持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("site_job_plan")
public class SiteJobPlanPO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 所属站点ID
     */
    private Integer siteId;

    /**
     * 周期计划配置JSON
     */
    private String periodConfig;

    /**
     * 所属方案ID
     */
    private Integer schemeId;

    /**
     * 运维小组ID（部门ID）
     */
    private Integer departmentId;

    /**
     * 任务计划状态
     */
    private String jobPlanState;

    /**
     * 创建人
     */
    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新人
     */
    private String updater;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;

    /**
     * 关联的站点信息（非数据库字段）
     */
    @TableField(exist = false)
    private SitePO site;

    /**
     * 关联的方案信息（非数据库字段）
     */
    @TableField(exist = false)
    private SchemePO scheme;

    /**
     * 关联的部门信息（非数据库字段）
     */
    @TableField(exist = false)
    private DepartmentPO department;
}
