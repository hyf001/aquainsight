package com.aquainsight.interfaces.rest.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 站点任务实例视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteJobInstanceVO {

    /**
     * 任务实例ID
     */
    private Integer id;

    /**
     * 任务计划ID
     */
    private Integer siteJobPlanId;

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
     * 运维方案ID
     */
    private Integer schemeId;

    /**
     * 运维方案名称
     */
    private String schemeName;

    /**
     * 任务项量（方案中的项目数量）
     */
    private Integer taskItemCount;

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
