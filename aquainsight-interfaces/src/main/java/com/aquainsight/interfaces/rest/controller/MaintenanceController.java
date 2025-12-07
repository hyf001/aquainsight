package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.MaintenanceApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.common.util.ThreadLocalUtil;
import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.types.JobParameter;
import com.aquainsight.domain.maintenance.types.ParameterType;
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
import org.springframework.format.annotation.DateTimeFormat;
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
            // 转换 DTO 为领域对象
            List<JobParameter> parameters = convertToJobParameters(request.getParameters());

            JobCategory jobCategory = maintenanceApplicationService.createJobCategory(
                    request.getName(),
                    request.getCode(),
                    parameters,
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
            // 转换 DTO 为领域对象
            List<JobParameter> parameters = convertToJobParameters(request.getParameters());

            JobCategory jobCategory = maintenanceApplicationService.updateJobCategory(
                    id,
                    request.getName(),
                    parameters,
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
        List<JobParameterDTO> parameterDTOs = null;
        if (jobCategory.getParameters() != null) {
            parameterDTOs = jobCategory.getParameters().stream()
                    .map(param -> JobParameterDTO.builder()
                            .name(param.getName())
                            .type(param.getType() != null ? param.getType().name() : null)
                            .required(param.getRequired())
                            .build())
                    .collect(Collectors.toList());
        }

        return JobCategoryVO.builder()
                .id(jobCategory.getId())
                .name(jobCategory.getName())
                .code(jobCategory.getCode())
                .parameters(parameterDTOs)
                .overdueDays(jobCategory.getOverdueDays())
                .description(jobCategory.getDescription())
                .createTime(jobCategory.getCreateTime() != null ? jobCategory.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(jobCategory.getUpdateTime() != null ? jobCategory.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * 将 DTO 列表转换为 JobParameter 列表
     */
    private List<JobParameter> convertToJobParameters(List<JobParameterDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }
        return dtos.stream()
                .map(dto -> JobParameter.builder()
                        .name(dto.getName())
                        .type(ParameterType.valueOf(dto.getType()))
                        .required(dto.getRequired())
                        .build())
                .collect(Collectors.toList());
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
    @GetMapping("/site-job-plans/all")
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
     * 分页查询站点任务计划
     *
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param siteName 站点名称（模糊查询）
     * @param enterpriseId 企业ID
     * @param siteId 站点ID
     * @param departmentId 运维小组（部门ID）
     * @return 分页结果
     */
    @GetMapping("/site-job-plans")
    public Response<PageResult<SiteJobPlanVO>> getSiteJobPlanPage(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteName,
            @RequestParam(required = false) Integer enterpriseId,
            @RequestParam(required = false) Integer siteId,
            @RequestParam(required = false) Integer departmentId) {
        try {
            IPage<SiteJobPlan> page = maintenanceApplicationService.getSiteJobPlanPage(
                    pageNum, pageSize, siteName, enterpriseId, siteId, departmentId);

            List<SiteJobPlanVO> voList = page.getRecords().stream()
                    .map(this::convertSiteJobPlanToVO)
                    .collect(Collectors.toList());

            PageResult<SiteJobPlanVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
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

            // 企业信息
            if (plan.getSite().getEnterprise() != null) {
                vo.setEnterpriseId(plan.getSite().getEnterprise().getId());
                vo.setEnterpriseName(plan.getSite().getEnterprise().getEnterpriseName());
            }
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

    // ========== 任务实例查询接口 ==========

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
    @GetMapping("/job-instances")
    public Response<PageResult<SiteJobInstanceVO>> getSiteJobInstancePage(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") java.time.LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") java.time.LocalDateTime endTime,
            @RequestParam(required = false) String creator,
            @RequestParam(required = false) Integer departmentId) {
        try {
            IPage<com.aquainsight.domain.maintenance.entity.SiteJobInstance> page =
                    maintenanceApplicationService.getSiteJobInstancePage(
                            pageNum, pageSize, siteName, status, startTime, endTime, creator, departmentId);

            List<SiteJobInstanceVO> voList = page.getRecords().stream()
                    .map(this::convertSiteJobInstanceToVO)
                    .collect(Collectors.toList());

            PageResult<SiteJobInstanceVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将站点任务实例实体转换为VO
     */
    private SiteJobInstanceVO convertSiteJobInstanceToVO(com.aquainsight.domain.maintenance.entity.SiteJobInstance instance) {
        SiteJobInstanceVO vo = SiteJobInstanceVO.builder()
                .id(instance.getId())
                .triggerTime(instance.getTriggerTime())
                .startTime(instance.getStartTime())
                .endTime(instance.getEndTime())
                .status(instance.getStatus() != null ? instance.getStatus().name() : null)
                .expiredTime(instance.getExpiredTime())
                .creator(instance.getCreator())
                .operator(instance.getOperator())
                .createTime(instance.getCreateTime())
                .updateTime(instance.getUpdateTime())
                .build();

        // 填充任务计划ID（仅作为标记）
        vo.setSiteJobPlanId(instance.getSiteJobPlanId());

        // 填充站点信息（直接从任务实例获取）
        if (instance.getSite() != null) {
            vo.setSiteId(instance.getSite().getId());
            vo.setSiteName(instance.getSite().getSiteName());
            vo.setSiteCode(instance.getSite().getSiteCode());

            // 填充企业信息
            if (instance.getSite().getEnterprise() != null) {
                vo.setEnterpriseId(instance.getSite().getEnterprise().getId());
                vo.setEnterpriseName(instance.getSite().getEnterprise().getEnterpriseName());
            }
        }

        // 填充方案信息（直接从任务实例获取）
        if (instance.getScheme() != null) {
            vo.setSchemeId(instance.getScheme().getId());
            vo.setSchemeName(instance.getScheme().getName());

            // 计算任务项量
            if (instance.getScheme().getItems() != null) {
                vo.setTaskItemCount(instance.getScheme().getItems().size());
            } else {
                vo.setTaskItemCount(0);
            }
        }

        // 填充部门信息（直接从任务实例获取）
        if (instance.getDepartment() != null) {
            vo.setDepartmentId(instance.getDepartment().getId());
            vo.setDepartmentName(instance.getDepartment().getName());
        }

        return vo;
    }

    // ========== 任务实例补齐接口 ==========

    /**
     * 补齐任务实例
     * 根据任务计划和时间范围，自动补齐缺失的任务实例
     */
    @PostMapping("/job-instances/backfill")
    public Response<BackfillResultVO> backfillJobInstances(@Valid @RequestBody BackfillJobInstancesRequest request) {
        try {
            // 获取当前用户
            User currentUser = ThreadLocalUtil.getUser();

            // 调用应用服务补齐任务实例
            List<com.aquainsight.domain.maintenance.entity.SiteJobInstance> backfilledInstances =
                    maintenanceApplicationService.backfillJobInstancesForPlan(
                            request.getSiteJobPlanId(),
                            request.getStartTime(),
                            request.getEndTime(),
                            currentUser.getName()
                    );

            // 转换为VO
            List<BackfillResultVO.JobInstanceInfo> instanceInfos = backfilledInstances.stream()
                    .map(instance -> BackfillResultVO.JobInstanceInfo.builder()
                            .id(instance.getId())
                            .triggerTime(instance.getTriggerTime())
                            .expiredTime(instance.getExpiredTime())
                            .status(instance.getStatus() != null ? instance.getStatus().name() : null)
                            .createTime(instance.getCreateTime())
                            .build())
                    .collect(Collectors.toList());

            BackfillResultVO resultVO = BackfillResultVO.builder()
                    .totalCount(backfilledInstances.size())
                    .instances(instanceInfos)
                    .build();

            return Response.success(resultVO);

        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        } catch (Exception e) {
            return Response.error("补齐任务实例失败: " + e.getMessage());
        }
    }

    /**
     * 手动创建任务实例
     * 根据站点、方案、部门信息创建一个任务实例（触发时间为当前时间）
     */
    @PostMapping("/job-instances")
    public Response<SiteJobInstanceVO> createManualJobInstance(@Valid @RequestBody CreateManualJobInstanceRequest request) {
        try {
            // 获取当前用户
            User currentUser = ThreadLocalUtil.getUser();

            // 调用应用服务创建任务实例
            com.aquainsight.domain.maintenance.entity.SiteJobInstance instance =
                    maintenanceApplicationService.createManualJobInstance(
                            request.getSiteId(),
                            request.getSchemeId(),
                            request.getDepartmentId(),
                            currentUser.getName()
                    );

            // 转换为VO
            SiteJobInstanceVO vo = convertSiteJobInstanceToVO(instance);

            return Response.success(vo);

        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        } catch (Exception e) {
            return Response.error("创建任务实例失败: " + e.getMessage());
        }
    }
}
