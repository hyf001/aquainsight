package com.aquainsight.application.service;

import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.repository.SiteJobPlanRepository;
import com.aquainsight.domain.maintenance.service.JobCategoryDomainService;
import com.aquainsight.domain.maintenance.service.SchemeDomainService;
import com.aquainsight.domain.maintenance.service.SiteJobInstanceDomainService;
import com.aquainsight.domain.maintenance.service.SiteJobPlanDomainService;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.aquainsight.domain.organization.entity.Department;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 维护管理应用服务
 */
@Service
@RequiredArgsConstructor
public class MaintenanceApplicationService {

    private final JobCategoryDomainService jobCategoryDomainService;
    private final SchemeDomainService schemeDomainService;
    private final SiteJobPlanDomainService siteJobPlanDomainService;
    private final SiteJobInstanceDomainService siteJobInstanceDomainService;
    private final SiteJobPlanRepository siteJobPlanRepository;
    private final SiteRepository siteRepository;

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

    /**
     * 分页查询站点任务计划
     *
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param siteName 站点名称（模糊查询）
     * @param enterpriseId 企业ID（查询该企业下所有站点的任务计划）
     * @param siteId 站点ID（精确查询）
     * @param departmentId 部门ID（运维小组）
     * @return 分页结果
     */
    public IPage<SiteJobPlan> getSiteJobPlanPage(Integer pageNum, Integer pageSize,
                                                  String siteName, Integer enterpriseId,
                                                  Integer siteId, Integer departmentId) {
        // 构建站点ID列表
        List<Integer> siteIds = null;

        // 如果有企业ID，先查询该企业下所有站点
        if (enterpriseId != null) {
            List<Site> sites = siteRepository.findByEnterpriseId(enterpriseId);
            siteIds = sites.stream()
                    .map(Site::getId)
                    .collect(Collectors.toList());

            // 如果企业下没有站点，返回空结果
            if (siteIds.isEmpty()) {
                siteIds = new ArrayList<>();
                siteIds.add(-1); // 添加一个不存在的ID，确保查询结果为空
            }
        }
        // 如果有站点ID，直接使用
        else if (siteId != null) {
            siteIds = new ArrayList<>();
            siteIds.add(siteId);
        }

        return siteJobPlanRepository.findPageWithDetails(pageNum, pageSize, siteName, siteIds, departmentId);
    }

    // ========== 定时任务相关 ==========

    /**
     * 生成所有启用中的任务计划的下一周期实例
     * 供定时任务调用
     *
     * @param creator 创建人（通常是"SYSTEM"）
     * @return 成功生成的任务实例列表
     */
    @Transactional(rollbackFor = Exception.class)
    public List<SiteJobInstance> generateNextInstancesForAllActivePlans(String creator) {
        // 查询所有启用中的任务计划
        List<SiteJobPlan> activeJobPlans = siteJobPlanRepository.findActiveJobPlansWithDetails();

        List<SiteJobInstance> generatedInstances = new ArrayList<>();

        for (SiteJobPlan jobPlan : activeJobPlans) {
            try {
                // 为每个计划生成下一周期的任务实例
                SiteJobInstance instance = siteJobInstanceDomainService.generateNextInstanceForPlan(jobPlan, creator);
                generatedInstances.add(instance);
            } catch (IllegalArgumentException e) {
                // 任务实例已存在或其他业务异常，跳过
                // 这里不抛出异常，继续处理其他计划
            }
        }

        return generatedInstances;
    }

    /**
     * 检查并标记所有逾期的任务实例
     * 供定时任务调用
     */
    @Transactional(rollbackFor = Exception.class)
    public void checkAndMarkAllOverdueInstances() {
        siteJobInstanceDomainService.checkAndMarkOverdueInstances();
    }

    /**
     * 分页查询任务实例
     *
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param siteName 站点名称（模糊查询）
     * @param status 任务状态
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param creator 创建人（模糊查询）
     * @param departmentId 运维小组（部门ID）
     * @return 分页结果
     */
    public IPage<SiteJobInstance> getSiteJobInstancePage(Integer pageNum, Integer pageSize,
                                                          String siteName, String status,
                                                          java.time.LocalDateTime startTime,
                                                          java.time.LocalDateTime endTime,
                                                          String creator, Integer departmentId) {
        return siteJobInstanceDomainService.getInstancePage(
                pageNum, pageSize, siteName, status, startTime, endTime, creator, departmentId);
    }

    /**
     * 根据任务计划补齐指定时间范围内缺失的任务实例
     *
     * @param siteJobPlanId 任务计划ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param operator 操作人
     * @return 补齐的任务实例列表
     */
    @Transactional(rollbackFor = Exception.class)
    public List<SiteJobInstance> backfillJobInstancesForPlan(Integer siteJobPlanId,
                                                              java.time.LocalDateTime startTime,
                                                              java.time.LocalDateTime endTime,
                                                              String operator) {
        // 查询任务计划（包含关联信息）
        SiteJobPlan siteJobPlan = siteJobPlanDomainService.getPlanByIdWithDetails(siteJobPlanId);

        if (siteJobPlan == null) {
            throw new IllegalArgumentException("任务计划不存在");
        }

        // 调用领域服务补齐任务实例
        return siteJobInstanceDomainService.backfillInstancesForPlan(
                siteJobPlan, startTime, endTime, operator);
    }
}
