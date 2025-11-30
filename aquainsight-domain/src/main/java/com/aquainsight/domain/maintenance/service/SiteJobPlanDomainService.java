package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.repository.SiteJobPlanRepository;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.organization.entity.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务计划领域服务
 */
@Service
@RequiredArgsConstructor
public class SiteJobPlanDomainService {

    private final SiteJobPlanRepository siteJobPlanRepository;

    /**
     * 创建站点任务计划
     * 一个站点只能有一个任务计划
     */
    public SiteJobPlan createPlan(Site site, PeriodConfig periodConfig, Scheme scheme,
                                   Department department, String creator) {
        if (site == null) {
            throw new IllegalArgumentException("站点不能为空");
        }

        // 检查站点是否已存在任务计划
        SiteJobPlan existingPlan = siteJobPlanRepository.findBySiteId(site.getId());
        if (existingPlan != null) {
            throw new IllegalArgumentException("该站点已存在任务计划，一个站点只能有一个任务计划");
        }

        SiteJobPlan plan = SiteJobPlan.builder()
                .site(site)
                .periodConfig(periodConfig)
                .scheme(scheme)
                .department(department)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return siteJobPlanRepository.save(plan);
    }

    /**
     * 更新站点任务计划
     */
    public SiteJobPlan updatePlan(Integer planId, PeriodConfig periodConfig, Scheme scheme,
                                   Department department, String updater) {
        SiteJobPlan plan = siteJobPlanRepository.findById(planId);
        if (plan == null) {
            throw new IllegalArgumentException("任务计划不存在");
        }

        plan.updateInfo(periodConfig, scheme, updater);
        if (department != null) {
            plan.setDepartment(department);
        }
        plan.setUpdateTime(LocalDateTime.now());

        return siteJobPlanRepository.save(plan);
    }

    /**
     * 根据站点ID更新或创建任务计划
     */
    public SiteJobPlan saveOrUpdateBySiteId(Site site, PeriodConfig periodConfig, Scheme scheme,
                                             Department department, String operator) {
        SiteJobPlan existingPlan = siteJobPlanRepository.findBySiteId(site.getId());

        if (existingPlan != null) {
            // 更新现有计划
            return updatePlan(existingPlan.getId(), periodConfig, scheme, department, operator);
        } else {
            // 创建新计划
            return createPlan(site, periodConfig, scheme, department, operator);
        }
    }

    /**
     * 根据ID获取任务计划
     */
    public SiteJobPlan getPlanById(Integer planId) {
        return siteJobPlanRepository.findById(planId);
    }

    /**
     * 根据站点ID获取任务计划
     */
    public SiteJobPlan getPlanBySiteId(Integer siteId) {
        return siteJobPlanRepository.findBySiteId(siteId);
    }

    /**
     * 根据ID获取任务计划（包含详情）
     */
    public SiteJobPlan getPlanByIdWithDetails(Integer planId) {
        return siteJobPlanRepository.findByIdWithDetails(planId);
    }

    /**
     * 根据站点ID获取任务计划（包含详情）
     */
    public SiteJobPlan getPlanBySiteIdWithDetails(Integer siteId) {
        return siteJobPlanRepository.findBySiteIdWithDetails(siteId);
    }

    /**
     * 获取所有任务计划
     */
    public List<SiteJobPlan> getAllPlans() {
        return siteJobPlanRepository.findAll();
    }

    /**
     * 删除任务计划
     */
    public void deletePlan(Integer planId) {
        SiteJobPlan plan = siteJobPlanRepository.findById(planId);
        if (plan == null) {
            throw new IllegalArgumentException("任务计划不存在");
        }
        siteJobPlanRepository.deleteById(planId);
    }

    /**
     * 批量删除任务计划
     */
    public void deletePlans(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        siteJobPlanRepository.deleteByIds(ids);
    }

    /**
     * 根据站点ID删除任务计划
     */
    public void deleteBySiteId(Integer siteId) {
        SiteJobPlan plan = siteJobPlanRepository.findBySiteId(siteId);
        if (plan != null) {
            siteJobPlanRepository.deleteById(plan.getId());
        }
    }
}
