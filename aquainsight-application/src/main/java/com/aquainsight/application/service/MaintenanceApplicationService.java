package com.aquainsight.application.service;

import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.service.JobCategoryDomainService;
import com.aquainsight.domain.maintenance.service.SchemeDomainService;
import com.aquainsight.domain.maintenance.service.SiteJobPlanDomainService;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.organization.entity.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 维护管理应用服务
 */
@Service
@RequiredArgsConstructor
public class MaintenanceApplicationService {

    private final JobCategoryDomainService jobCategoryDomainService;
    private final SchemeDomainService schemeDomainService;
    private final SiteJobPlanDomainService siteJobPlanDomainService;

    /**
     * 创建作业类别
     */
    @Transactional(rollbackFor = Exception.class)
    public JobCategory createJobCategory(String name, String code, Integer needPhoto,
                                        String photoTypes, Integer overdueDays, String description) {
        return jobCategoryDomainService.createJobCategory(name, code, needPhoto, photoTypes, overdueDays, description);
    }

    /**
     * 更新作业类别
     */
    @Transactional(rollbackFor = Exception.class)
    public JobCategory updateJobCategory(Integer id, String name, Integer needPhoto,
                                        String photoTypes, Integer overdueDays, String description) {
        return jobCategoryDomainService.updateJobCategoryInfo(id, name, needPhoto, photoTypes, overdueDays, description);
    }

    /**
     * 获取作业类别详情
     */
    public JobCategory getJobCategory(Integer id) {
        return jobCategoryDomainService.getJobCategoryById(id);
    }

    /**
     * 获取所有作业类别
     */
    public List<JobCategory> getAllJobCategories() {
        return jobCategoryDomainService.getAllJobCategories();
    }

    /**
     * 搜索作业类别
     */
    public List<JobCategory> searchJobCategories(String name) {
        return jobCategoryDomainService.searchJobCategoriesByName(name);
    }

    /**
     * 删除作业类别
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteJobCategory(Integer id) {
        jobCategoryDomainService.deleteJobCategory(id);
    }

    /**
     * 批量删除作业类别
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteJobCategories(List<Integer> ids) {
        jobCategoryDomainService.deleteJobCategories(ids);
    }

    // ========== 方案管理 ==========

    /**
     * 创建方案
     */
    @Transactional(rollbackFor = Exception.class)
    public Scheme createScheme(String name, String code, String creator) {
        return schemeDomainService.createScheme(name, code, creator);
    }

    /**
     * 更新方案
     */
    @Transactional(rollbackFor = Exception.class)
    public Scheme updateScheme(Integer id, String name, String updater) {
        return schemeDomainService.updateSchemeInfo(id, name, updater);
    }

    /**
     * 获取方案详情
     */
    public Scheme getScheme(Integer id) {
        return schemeDomainService.getSchemeById(id);
    }

    /**
     * 获取方案详情（包含方案项目）
     */
    public Scheme getSchemeWithItems(Integer id) {
        return schemeDomainService.getSchemeByIdWithItems(id);
    }

    /**
     * 获取所有方案
     */
    public List<Scheme> getAllSchemes() {
        return schemeDomainService.getAllSchemes();
    }

    /**
     * 搜索方案
     */
    public List<Scheme> searchSchemes(String name) {
        return schemeDomainService.searchSchemesByName(name);
    }

    /**
     * 删除方案
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteScheme(Integer id) {
        schemeDomainService.deleteScheme(id);
    }

    /**
     * 批量删除方案
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteSchemes(List<Integer> ids) {
        schemeDomainService.deleteSchemes(ids);
    }

    /**
     * 添加方案项目
     */
    @Transactional(rollbackFor = Exception.class)
    public SchemeItem addSchemeItem(Integer schemeId, SchemeItem schemeItem) {
        return schemeDomainService.addSchemeItem(schemeId, schemeItem);
    }

    /**
     * 更新方案项目
     */
    @Transactional(rollbackFor = Exception.class)
    public SchemeItem updateSchemeItem(SchemeItem schemeItem) {
        return schemeDomainService.updateSchemeItem(schemeItem);
    }

    /**
     * 删除方案项目
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteSchemeItem(Integer schemeItemId) {
        schemeDomainService.deleteSchemeItem(schemeItemId);
    }

    /**
     * 获取方案的所有项目
     */
    public List<SchemeItem> getSchemeItems(Integer schemeId) {
        return schemeDomainService.getSchemeItems(schemeId);
    }

    // ========== 站点任务计划管理 ==========

    /**
     * 配置站点任务计划
     * 一个站点只能有一个任务计划，如果已存在则更新
     */
    @Transactional(rollbackFor = Exception.class)
    public SiteJobPlan configureSiteJobPlan(Site site, PeriodConfig periodConfig, Scheme scheme,
                                             Department department, String operator) {
        return siteJobPlanDomainService.saveOrUpdateBySiteId(site, periodConfig, scheme, department, operator);
    }

    /**
     * 根据站点ID获取任务计划
     */
    public SiteJobPlan getSiteJobPlanBySiteId(Integer siteId) {
        return siteJobPlanDomainService.getPlanBySiteId(siteId);
    }

    /**
     * 根据站点ID获取任务计划（包含详情）
     */
    public SiteJobPlan getSiteJobPlanBySiteIdWithDetails(Integer siteId) {
        return siteJobPlanDomainService.getPlanBySiteIdWithDetails(siteId);
    }

    /**
     * 获取所有站点任务计划
     */
    public List<SiteJobPlan> getAllSiteJobPlans() {
        return siteJobPlanDomainService.getAllPlans();
    }

    /**
     * 删除站点任务计划
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteSiteJobPlan(Integer planId) {
        siteJobPlanDomainService.deletePlan(planId);
    }

    /**
     * 根据站点ID删除任务计划
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteSiteJobPlanBySiteId(Integer siteId) {
        siteJobPlanDomainService.deleteBySiteId(siteId);
    }
}
