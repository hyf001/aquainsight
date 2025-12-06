package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.types.JobInstanceStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务实例仓储接口
 */
public interface SiteJobInstanceRepository {

    /**
     * 保存任务实例
     */
    SiteJobInstance save(SiteJobInstance siteJobInstance);

    /**
     * 根据ID查询任务实例
     */
    SiteJobInstance findById(Integer id);

    /**
     * 根据任务计划ID查询所有任务实例
     */
    List<SiteJobInstance> findBySiteJobPlanId(Integer siteJobPlanId);

    /**
     * 根据状态查询任务实例
     */
    List<SiteJobInstance> findByStatus(JobInstanceStatus status);

    /**
     * 根据处理人查询任务实例
     */
    List<SiteJobInstance> findByOperator(String operator);

    /**
     * 查询需要检查是否逾期的任务实例（待处理和进行中的任务）
     */
    List<SiteJobInstance> findInstancesToCheckOverdue(LocalDateTime currentTime);

    /**
     * 根据站点ID查询任务实例
     */
    List<SiteJobInstance> findBySiteId(Integer siteId);

    /**
     * 根据时间范围查询任务实例
     */
    List<SiteJobInstance> findByTriggerTimeRange(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 删除任务实例
     */
    void deleteById(Integer id);

    /**
     * 批量删除任务实例
     */
    void deleteByIds(List<Integer> ids);

    /**
     * 根据ID查询任务实例（包含任务计划详情）
     */
    SiteJobInstance findByIdWithPlan(Integer id);

    /**
     * 查询待处理的任务实例
     */
    List<SiteJobInstance> findPendingInstances();

    /**
     * 查询进行中的任务实例
     */
    List<SiteJobInstance> findInProgressInstances();

    /**
     * 查询所有即将过期的任务实例（状态为EXPIRING）
     */
    List<SiteJobInstance> findExpiringInstances();

    /**
     * 查询所有已过期的任务实例（状态为OVERDUE）
     */
    List<SiteJobInstance> findOverdueInstances();

    /**
     * 根据任务计划ID和派发时间查询任务实例
     */
    SiteJobInstance findBySiteJobPlanIdAndTriggerTime(Integer siteJobPlanId, LocalDateTime triggerTime);

    /**
     * 分页查询任务实例（包含关联的任务计划详情）
     */
    com.baomidou.mybatisplus.core.metadata.IPage<SiteJobInstance> findPageWithDetails(
            Integer pageNum, Integer pageSize,
            String siteName, String status, LocalDateTime startTime, LocalDateTime endTime,
            String creator, Integer departmentId);
}
