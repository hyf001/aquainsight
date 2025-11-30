package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.MaintenanceApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.common.util.ThreadLocalUtil;
import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.maintenance.types.PeriodType;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.service.SiteDomainService;
import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.service.DepartmentDomainService;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.interfaces.rest.dto.*;
import com.aquainsight.interfaces.rest.vo.*;
import com.aquainsight.common.util.PageResult;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 维护管理控制器
 *
 * @author aquainsight
 */
@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceApplicationService maintenanceApplicationService;
    private final SiteDomainService siteDomainService;
    private final DepartmentDomainService departmentDomainService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 创建作业类别
     */
    @PostMapping("/job-categories")
    public Response<JobCategoryVO> createJobCategory(@Valid @RequestBody CreateJobCategoryRequest request) {
        try {
            JobCategory jobCategory = maintenanceApplicationService.createJobCategory(
                    request.getName(),
                    request.getCode(),
                    request.getNeedPhoto(),
                    request.getPhotoTypes(),
                    request.getOverdueDays(),
                    request.getDescription()
            );
            return Response.success(convertToVO(jobCategory));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新作业类别
     */
    @PutMapping("/job-categories/{id}")
    public Response<JobCategoryVO> updateJobCategory(@PathVariable Integer id,
                                                     @RequestBody UpdateJobCategoryRequest request) {
        try {
            JobCategory jobCategory = maintenanceApplicationService.updateJobCategory(
                    id,
                    request.getName(),
                    request.getNeedPhoto(),
                    request.getPhotoTypes(),
                    request.getOverdueDays(),
                    request.getDescription()
            );
            return Response.success(convertToVO(jobCategory));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取作业类别详情
     */
    @GetMapping("/job-categories/{id}")
    public Response<JobCategoryVO> getJobCategoryById(@PathVariable Integer id) {
        try {
            JobCategory jobCategory = maintenanceApplicationService.getJobCategory(id);
            if (jobCategory == null) {
                return Response.error("作业类别不存在");
            }
            return Response.success(convertToVO(jobCategory));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有作业类别
     */
    @GetMapping("/job-categories")
    public Response<List<JobCategoryVO>> listJobCategories(@RequestParam(required = false) String name) {
        try {
            List<JobCategory> jobCategories;
            if (name != null && !name.trim().isEmpty()) {
                jobCategories = maintenanceApplicationService.searchJobCategories(name);
            } else {
                jobCategories = maintenanceApplicationService.getAllJobCategories();
            }
            List<JobCategoryVO> voList = jobCategories.stream()
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除作业类别
     */
    @DeleteMapping("/job-categories/{id}")
    public Response<Void> deleteJobCategory(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteJobCategory(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 批量删除作业类别
     */
    @DeleteMapping("/job-categories")
    public Response<Void> deleteJobCategories(@RequestBody List<Integer> ids) {
        try {
            maintenanceApplicationService.deleteJobCategories(ids);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ========== 方案管理 ==========

    /**
     * 创建方案
     */
    @PostMapping("/schemes")
    public Response<SchemeVO> createScheme(@Valid @RequestBody CreateSchemeRequest request) {
        try {
            User creator = ThreadLocalUtil.getUser();
            Scheme scheme = maintenanceApplicationService.createScheme(
                    request.getName(),
                    request.getCode(),
                    creator.getName()
            );
            return Response.success(convertSchemeToVO(scheme));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新方案
     */
    @PutMapping("/schemes/{id}")
    public Response<SchemeVO> updateScheme(@PathVariable Integer id,
                                           @Valid @RequestBody UpdateSchemeRequest request) {
        try {
            User updater = ThreadLocalUtil.getUser();
            Scheme scheme = maintenanceApplicationService.updateScheme(
                    id,
                    request.getName(),
                    updater.getName()
            );
            return Response.success(convertSchemeToVO(scheme));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取方案详情
     */
    @GetMapping("/schemes/{id}")
    public Response<SchemeVO> getSchemeById(@PathVariable Integer id,
                                            @RequestParam(required = false, defaultValue = "false") Boolean withItems) {
        try {
            Scheme scheme;
            if (withItems) {
                scheme = maintenanceApplicationService.getSchemeWithItems(id);
            } else {
                scheme = maintenanceApplicationService.getScheme(id);
            }
            if (scheme == null) {
                return Response.error("方案不存在");
            }
            return Response.success(convertSchemeToVO(scheme));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有方案
     */
    @GetMapping("/schemes")
    public Response<List<SchemeVO>> listSchemes(@RequestParam(required = false) String name) {
        try {
            List<Scheme> schemes;
            if (name != null && !name.trim().isEmpty()) {
                schemes = maintenanceApplicationService.searchSchemes(name);
            } else {
                schemes = maintenanceApplicationService.getAllSchemes();
            }
            List<SchemeVO> voList = schemes.stream()
                    .map(this::convertSchemeToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除方案
     */
    @DeleteMapping("/schemes/{id}")
    public Response<Void> deleteScheme(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteScheme(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 批量删除方案
     */
    @DeleteMapping("/schemes")
    public Response<Void> deleteSchemes(@RequestBody List<Integer> ids) {
        try {
            maintenanceApplicationService.deleteSchemes(ids);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ========== 方案项目管理 ==========

    /**
     * 添加方案项目
     */
    @PostMapping("/scheme-items")
    public Response<SchemeItemVO> addSchemeItem(@Valid @RequestBody CreateSchemeItemRequest request) {
        try {
            SchemeItem schemeItem = SchemeItem.builder()
                    .jobCategoryId(request.getJobCategoryId())
                    .itemName(request.getItemName())
                    .description(request.getDescription())
                    .build();
            SchemeItem savedItem = maintenanceApplicationService.addSchemeItem(request.getSchemeId(), schemeItem);
            return Response.success(convertSchemeItemToVO(savedItem));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新方案项目
     */
    @PutMapping("/scheme-items/{id}")
    public Response<SchemeItemVO> updateSchemeItem(@PathVariable Integer id,
                                                   @Valid @RequestBody UpdateSchemeItemRequest request) {
        try {
            SchemeItem schemeItem = SchemeItem.builder()
                    .id(id)
                    .itemName(request.getItemName())
                    .description(request.getDescription())
                    .build();
            SchemeItem updatedItem = maintenanceApplicationService.updateSchemeItem(schemeItem);
            return Response.success(convertSchemeItemToVO(updatedItem));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除方案项目
     */
    @DeleteMapping("/scheme-items/{id}")
    public Response<Void> deleteSchemeItem(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteSchemeItem(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取方案的所有项目
     */
    @GetMapping("/schemes/{schemeId}/items")
    public Response<List<SchemeItemVO>> getSchemeItems(@PathVariable Integer schemeId) {
        try {
            List<SchemeItem> items = maintenanceApplicationService.getSchemeItems(schemeId);
            List<SchemeItemVO> voList = items.stream()
                    .map(this::convertSchemeItemToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将作业类别实体转换为VO
     */
    private JobCategoryVO convertToVO(JobCategory jobCategory) {
        return JobCategoryVO.builder()
                .id(jobCategory.getId())
                .name(jobCategory.getName())
                .code(jobCategory.getCode())
                .needPhoto(jobCategory.getNeedPhoto())
                .photoTypes(jobCategory.getPhotoTypes())
                .overdueDays(jobCategory.getOverdueDays())
                .description(jobCategory.getDescription())
                .createTime(jobCategory.getCreateTime() != null ? jobCategory.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(jobCategory.getUpdateTime() != null ? jobCategory.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * 将方案实体转换为VO
     */
    private SchemeVO convertSchemeToVO(Scheme scheme) {
        SchemeVO vo = SchemeVO.builder()
                .id(scheme.getId())
                .name(scheme.getName())
                .code(scheme.getCode())
                .creator(scheme.getCreator())
                .createTime(scheme.getCreateTime())
                .updateTime(scheme.getUpdateTime())
                .build();

        if (scheme.getItems() != null) {
            List<SchemeItemVO> itemVOs = scheme.getItems().stream()
                    .map(this::convertSchemeItemToVO)
                    .collect(Collectors.toList());
            vo.setItems(itemVOs);
        }

        return vo;
    }

    /**
     * 将方案项目实体转换为VO
     */
    private SchemeItemVO convertSchemeItemToVO(SchemeItem item) {
        SchemeItemVO vo = SchemeItemVO.builder()
                .id(item.getId())
                .schemeId(item.getSchemeId())
                .jobCategoryId(item.getJobCategoryId())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .createTime(item.getCreateTime())
                .updateTime(item.getUpdateTime())
                .build();

        if (item.getJobCategory() != null) {
            vo.setJobCategory(convertToVO(item.getJobCategory()));
        }

        return vo;
    }

    // ========== 站点任务计划管理 ==========

    /**
     * 配置站点任务计划
     */
    @PostMapping("/site-job-plans")
    public Response<SiteJobPlanVO> configureSiteJobPlan(@Valid @RequestBody ConfigureSiteJobPlanRequest request) {
        User currentUser = ThreadLocalUtil.getUser();
        String operator = currentUser.getName();

        // 获取站点
        Site site = siteDomainService.getSiteById(request.getSiteId()).orElse(null);
        if (site == null) {
            return Response.error("站点不存在");
        }

        // 获取方案
        Scheme scheme = maintenanceApplicationService.getScheme(request.getSchemeId());

        // 构建周期配置
        PeriodConfig periodConfig = new PeriodConfig();
        if(request.getPeriodConfig() != null && request.getPeriodConfig().getPeriodType() != null){
            periodConfig.setPertioType(PeriodType.valueOf(request.getPeriodConfig().getPeriodType()));
            periodConfig.setN(request.getPeriodConfig().getN());
        }
        
        // 获取部门（可选）
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentDomainService.getDepartmentById(request.getDepartmentId()).orElse(null);
        }

        SiteJobPlan siteJobPlan = maintenanceApplicationService.configureSiteJobPlan(
                site, periodConfig, scheme, department, operator);

        return Response.success(convertSiteJobPlanToVO(siteJobPlan));
    }

    /**
     * 根据站点ID获取任务计划
     */
    @GetMapping("/site-job-plans/site/{siteId}")
    public Response<SiteJobPlanVO> getSiteJobPlanBySiteId(@PathVariable Integer siteId) {
        try {
            SiteJobPlan siteJobPlan = maintenanceApplicationService.getSiteJobPlanBySiteIdWithDetails(siteId);
            if (siteJobPlan == null) {
                return Response.success(null);
            }
            return Response.success(convertSiteJobPlanToVO(siteJobPlan));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有站点任务计划
     */
    @GetMapping("/site-job-plans")
    public Response<List<SiteJobPlanVO>> getAllSiteJobPlans() {
        try {
            List<SiteJobPlan> plans = maintenanceApplicationService.getAllSiteJobPlans();
            List<SiteJobPlanVO> voList = plans.stream()
                    .map(this::convertSiteJobPlanToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除站点任务计划
     */
    @DeleteMapping("/site-job-plans/{id}")
    public Response<Void> deleteSiteJobPlan(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteSiteJobPlan(id);
            return Response.success(null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页查询站点及其任务计划
     */
    @GetMapping("/sites-with-job-plans")
    public Response<PageResult<SiteWithJobPlanVO>> getSitesWithJobPlans(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteType,
            @RequestParam(required = false) Integer enterpriseId) {
        try {
            // 获取站点分页列表
            IPage<Site> page = siteDomainService.getSitePage(pageNum, pageSize, siteType, enterpriseId);

            // 转换为带任务计划的VO列表
            List<SiteWithJobPlanVO> voList = page.getRecords().stream()
                    .map(site -> {
                        SiteWithJobPlanVO vo = convertSiteToWithJobPlanVO(site);

                        // 查询该站点的任务计划
                        try {
                            SiteJobPlan jobPlan = maintenanceApplicationService.getSiteJobPlanBySiteIdWithDetails(site.getId());
                            if (jobPlan != null) {
                                fillJobPlanInfo(vo, jobPlan);
                            }
                        } catch (Exception e) {
                            // 站点没有任务计划，忽略
                        }

                        return vo;
                    })
                    .collect(Collectors.toList());

            PageResult<SiteWithJobPlanVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);

            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将站点实体转换为SiteWithJobPlanVO
     */
    private SiteWithJobPlanVO convertSiteToWithJobPlanVO(Site site) {
        return SiteWithJobPlanVO.builder()
                .id(site.getId())
                .siteCode(site.getSiteCode())
                .siteName(site.getSiteName())
                .siteType(site.getSiteType())
                .siteTag(site.getSiteTag())
                .longitude(site.getLongitude())
                .latitude(site.getLatitude())
                .address(site.getAddress())
                .isAutoUpload(site.getIsAutoUpload())
                .enterpriseId(site.getEnterprise() != null ? site.getEnterprise().getId() : null)
                .enterpriseName(site.getEnterprise() != null ? site.getEnterprise().getEnterpriseName() : null)
                .createTime(site.getCreateTime() != null ? site.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(site.getUpdateTime() != null ? site.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * 填充任务计划信息到VO
     */
    private void fillJobPlanInfo(SiteWithJobPlanVO vo, SiteJobPlan jobPlan) {
        vo.setJobPlanId(jobPlan.getId());
        vo.setJobPlanState(jobPlan.getJobPlanState() != null ? jobPlan.getJobPlanState().getDescription() : null);
        vo.setJobPlanCreator(jobPlan.getCreator());
        vo.setJobPlanCreateTime(jobPlan.getCreateTime() != null ? jobPlan.getCreateTime().format(DATE_FORMATTER) : null);
        vo.setJobPlanUpdater(jobPlan.getUpdater());
        vo.setJobPlanUpdateTime(jobPlan.getUpdateTime() != null ? jobPlan.getUpdateTime().format(DATE_FORMATTER) : null);

        // 部门信息
        if (jobPlan.getDepartment() != null) {
            vo.setDepartmentId(jobPlan.getDepartment().getId());
            vo.setDepartmentName(jobPlan.getDepartment().getName());
        }

        // 方案信息
        if (jobPlan.getScheme() != null) {
            vo.setSchemeId(jobPlan.getScheme().getId());
            vo.setSchemeName(jobPlan.getScheme().getName());
            vo.setSchemeCode(jobPlan.getScheme().getCode());
        }

        // 周期配置
        if (jobPlan.getPeriodConfig() != null && jobPlan.getPeriodConfig().getPertioType() != null) {
            SiteWithJobPlanVO.PeriodConfigVO periodConfigVO = SiteWithJobPlanVO.PeriodConfigVO.builder()
                    .periodType(jobPlan.getPeriodConfig().getPertioType().name())
                    .n(jobPlan.getPeriodConfig().getN())
                    .build();
            vo.setPeriodConfig(periodConfigVO);
        }
    }

    /**
     * 将站点任务计划实体转换为VO
     */
    private SiteJobPlanVO convertSiteJobPlanToVO(SiteJobPlan plan) {
        SiteJobPlanVO vo = SiteJobPlanVO.builder()
                .id(plan.getId())
                .jobPlanState(plan.getJobPlanState() != null ? plan.getJobPlanState().getDescription() : null)
                .creator(plan.getCreator())
                .createTime(plan.getCreateTime())
                .updater(plan.getUpdater())
                .updateTime(plan.getUpdateTime())
                .build();

        // 周期配置
        if (plan.getPeriodConfig() != null && plan.getPeriodConfig().getPertioType() != null) {
            SiteJobPlanVO.PeriodConfigVO periodConfigVO = SiteJobPlanVO.PeriodConfigVO.builder()
                    .periodType(plan.getPeriodConfig().getPertioType().name())
                    .n(plan.getPeriodConfig().getN())
                    .build();
            vo.setPeriodConfig(periodConfigVO);
        }

        // 站点信息
        if (plan.getSite() != null) {
            vo.setSiteId(plan.getSite().getId());
            vo.setSiteName(plan.getSite().getSiteName());
            vo.setSiteCode(plan.getSite().getSiteCode());
        }

        // 方案信息
        if (plan.getScheme() != null) {
            vo.setSchemeId(plan.getScheme().getId());
            vo.setSchemeName(plan.getScheme().getName());
        }

        // 部门信息
        if (plan.getDepartment() != null) {
            vo.setDepartmentId(plan.getDepartment().getId());
            vo.setDepartmentName(plan.getDepartment().getName());
        }

        return vo;
    }
}
