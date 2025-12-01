package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.baomidou.mybatisplus.core.metadata.IPage;

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

    /**
     * 分页查询站点任务计划（包含关联信息）
     *
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param siteName 站点名称（模糊查询）
     * @param siteIds 站点ID列表（用于企业过滤或站点过滤）
     * @param departmentId 部门ID（运维小组）
     * @return 分页结果
     */
    IPage<SiteJobPlan> findPageWithDetails(Integer pageNum, Integer pageSize,
                                           String siteName, List<Integer> siteIds,
                                           Integer departmentId);

    /**
     * 查询所有启用中的任务计划（包含关联信息）
     * 用于定时任务生成实例
     */
    List<SiteJobPlan> findActiveJobPlansWithDetails();
}
