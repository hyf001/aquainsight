package com.aquainsight.interfaces.rest.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务详情视图对象（包含步骤和模版信息）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDetailVO {

    /**
     * 任务ID
     */
    private Integer id;

    /**
     * 任务调度ID
     */
    private Integer taskSchedulerId;

    /**
     * 站点ID
     */
    private Integer siteId;

    /**
     * 站点名称
     */
    private String siteName;

    /**
     * 站点编码
     */
    private String siteCode;

    /**
     * 企业ID
     */
    private Integer enterpriseId;

    /**
     * 企业名称（所属客户）
     */
    private String enterpriseName;

    /**
     * 任务派发时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime triggerTime;

    /**
     * 任务开始时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 任务结束时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    /**
     * 任务状态
     */
    private String status;

    /**
     * 任务过期时间（任务期限）
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiredTime;

    /**
     * 运维任务模版ID
     */
    private Integer taskTemplateId;

    /**
     * 运维任务模版名称
     */
    private String taskTemplateName;

    /**
     * 运维小组ID
     */
    private Integer departmentId;

    /**
     * 运维小组名称
     */
    private String departmentName;

    /**
     * 创建人（发布者）
     */
    private String creator;

    /**
     * 任务处理人
     */
    private String operator;

    /**
     * 任务模版项目列表（包含步骤模版配置）
     */
    private List<TaskTemplateItemVO> taskTemplateItems;

    /**
     * 步骤执行列表（已填写的步骤数据）
     */
    private List<StepVO> steps;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}
