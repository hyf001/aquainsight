package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.SiteJobPlan;

import java.util.List;

/**
 * 站点任务计划仓储接口
 */
public interface SiteJobPlanRepository {

    /**
     * 保存任务计划
     */
    SiteJobPlan save(SiteJobPlan siteJobPlan);

    /**
     * 根据ID查询任务计划
     */
    SiteJobPlan findById(Integer id);

    /**
     * 根据站点ID查询任务计划
     */
    SiteJobPlan findBySiteId(Integer siteId);

    /**
     * 根据ID查询任务计划（包含关联信息）
     */
    SiteJobPlan findByIdWithDetails(Integer id);

    /**
     * 根据站点ID查询任务计划（包含关联信息）
     */
    SiteJobPlan findBySiteIdWithDetails(Integer siteId);

    /**
     * 查询所有任务计划
     */
    List<SiteJobPlan> findAll();

    /**
     * 删除任务计划
     */
    void deleteById(Integer id);

    /**
     * 批量删除任务计划
     */
    void deleteByIds(List<Integer> ids);
}
