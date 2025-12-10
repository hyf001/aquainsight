package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.MaintenanceApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.common.util.ThreadLocalUtil;
import com.aquainsight.domain.maintenance.entity.StepTemplate;
import com.aquainsight.domain.maintenance.entity.TaskTemplate;
import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;
import com.aquainsight.domain.maintenance.entity.TaskScheduler;
import com.aquainsight.domain.maintenance.types.StepParameter;
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
     * 创建步骤模版
     */
    @PostMapping("/step-templates")
    public Response<StepTemplateVO> createStepTemplate(@Valid @RequestBody CreateStepTemplateRequest request) {
        try {
            // 转换 DTO 为领域对象
            List<StepParameter> parameters = convertToJobParameters(request.getParameters());

            StepTemplate stepTemplate = maintenanceApplicationService.createStepTemplate(
                    request.getName(),
                    request.getCode(),
                    parameters,
                    request.getOverdueDays(),
                    request.getDescription()
            );
            return Response.success(convertToVO(stepTemplate));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新步骤模版
     */
    @PutMapping("/step-templates/{id}")
    public Response<StepTemplateVO> updateStepTemplate(@PathVariable Integer id,
                                                     @RequestBody UpdateStepTemplateRequest request) {
        try {
            // 转换 DTO 为领域对象
            List<StepParameter> parameters = convertToJobParameters(request.getParameters());

            StepTemplate stepTemplate = maintenanceApplicationService.updateStepTemplate(
                    id,
                    request.getName(),
                    parameters,
                    request.getOverdueDays(),
                    request.getDescription()
            );
            return Response.success(convertToVO(stepTemplate));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取步骤模版详情
     */
    @GetMapping("/step-templates/{id}")
    public Response<StepTemplateVO> getStepTemplateById(@PathVariable Integer id) {
        try {
            StepTemplate stepTemplate = maintenanceApplicationService.getStepTemplate(id);
            if (stepTemplate == null) {
                return Response.error("步骤模版不存在");
            }
            return Response.success(convertToVO(stepTemplate));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有步骤模版
     */
    @GetMapping("/step-templates")
    public Response<List<StepTemplateVO>> listJobCategories(@RequestParam(required = false) String name) {
        try {
            List<StepTemplate> jobCategories;
            if (name != null && !name.trim().isEmpty()) {
                jobCategories = maintenanceApplicationService.searchJobCategories(name);
            } else {
                jobCategories = maintenanceApplicationService.getAllJobCategories();
            }
            List<StepTemplateVO> voList = jobCategories.stream()
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除步骤模版
     */
    @DeleteMapping("/step-templates/{id}")
    public Response<Void> deleteStepTemplate(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteStepTemplate(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 批量删除步骤模版
     */
    @DeleteMapping("/step-templates")
    public Response<Void> deleteJobCategories(@RequestBody List<Integer> ids) {
        try {
            maintenanceApplicationService.deleteJobCategories(ids);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ========== 任务模版管理 ==========

    /**
     * 创建任务模版
     */
    @PostMapping("/taskTemplates")
    public Response<TaskTemplateVO> createTaskTemplate(@Valid @RequestBody CreateTaskTemplateRequest request) {
        try {
            User creator = ThreadLocalUtil.getUser();
            TaskTemplate taskTemplate = maintenanceApplicationService.createTaskTemplate(
                    request.getName(),
                    request.getCode(),
                    creator.getName()
            );
            return Response.success(convertTaskTemplateToVO(taskTemplate));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新任务模版
     */
    @PutMapping("/taskTemplates/{id}")
    public Response<TaskTemplateVO> updateTaskTemplate(@PathVariable Integer id,
                                           @Valid @RequestBody UpdateTaskTemplateRequest request) {
        try {
            User updater = ThreadLocalUtil.getUser();
            TaskTemplate taskTemplate = maintenanceApplicationService.updateTaskTemplate(
                    id,
                    request.getName(),
                    updater.getName()
            );
            return Response.success(convertTaskTemplateToVO(taskTemplate));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取任务模版详情
     */
    @GetMapping("/taskTemplates/{id}")
    public Response<TaskTemplateVO> getTaskTemplateById(@PathVariable Integer id,
                                            @RequestParam(required = false, defaultValue = "false") Boolean withItems) {
        try {
            TaskTemplate taskTemplate;
            if (withItems) {
                taskTemplate = maintenanceApplicationService.getTaskTemplateWithItems(id);
            } else {
                taskTemplate = maintenanceApplicationService.getTaskTemplate(id);
            }
            if (taskTemplate == null) {
                return Response.error("任务模版不存在");
            }
            return Response.success(convertTaskTemplateToVO(taskTemplate));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有任务模版
     */
    @GetMapping("/taskTemplates")
    public Response<List<TaskTemplateVO>> listTaskTemplates(@RequestParam(required = false) String name) {
        try {
            List<TaskTemplate> taskTemplates;
            if (name != null && !name.trim().isEmpty()) {
                taskTemplates = maintenanceApplicationService.searchTaskTemplates(name);
            } else {
                taskTemplates = maintenanceApplicationService.getAllTaskTemplates();
            }
            List<TaskTemplateVO> voList = taskTemplates.stream()
                    .map(this::convertTaskTemplateToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除任务模版
     */
    @DeleteMapping("/taskTemplates/{id}")
    public Response<Void> deleteTaskTemplate(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteTaskTemplate(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 批量删除任务模版
     */
    @DeleteMapping("/taskTemplates")
    public Response<Void> deleteTaskTemplates(@RequestBody List<Integer> ids) {
        try {
            maintenanceApplicationService.deleteTaskTemplates(ids);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ========== 任务模版项目管理 ==========

    /**
     * 添加任务模版项目
     */
    @PostMapping("/taskTemplate-items")
    public Response<TaskTemplateItemVO> addTaskTemplateItem(@Valid @RequestBody CreateTaskTemplateItemRequest request) {
        try {
            TaskTemplateItem taskTemplateItem = TaskTemplateItem.builder()
                    .stepTemplateId(request.getStepTemplateId())
                    .itemName(request.getItemName())
                    .description(request.getDescription())
                    .build();
            TaskTemplateItem savedItem = maintenanceApplicationService.addTaskTemplateItem(request.getTaskTemplateId(), taskTemplateItem);
            return Response.success(convertTaskTemplateItemToVO(savedItem));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新任务模版项目
     */
    @PutMapping("/taskTemplate-items/{id}")
    public Response<TaskTemplateItemVO> updateTaskTemplateItem(@PathVariable Integer id,
                                                   @Valid @RequestBody UpdateTaskTemplateItemRequest request) {
        try {
            TaskTemplateItem taskTemplateItem = TaskTemplateItem.builder()
                    .id(id)
                    .itemName(request.getItemName())
                    .description(request.getDescription())
                    .build();
            TaskTemplateItem updatedItem = maintenanceApplicationService.updateTaskTemplateItem(taskTemplateItem);
            return Response.success(convertTaskTemplateItemToVO(updatedItem));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除任务模版项目
     */
    @DeleteMapping("/taskTemplate-items/{id}")
    public Response<Void> deleteTaskTemplateItem(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteTaskTemplateItem(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取任务模版的所有项目
     */
    @GetMapping("/taskTemplates/{taskTemplateId}/items")
    public Response<List<TaskTemplateItemVO>> getTaskTemplateItems(@PathVariable Integer taskTemplateId) {
        try {
            List<TaskTemplateItem> items = maintenanceApplicationService.getTaskTemplateItems(taskTemplateId);
            List<TaskTemplateItemVO> voList = items.stream()
                    .map(this::convertTaskTemplateItemToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将步骤模版实体转换为VO
     */
    private StepTemplateVO convertToVO(StepTemplate stepTemplate) {
        List<JobParameterDTO> parameterDTOs = null;
        if (stepTemplate.getParameters() != null) {
            parameterDTOs = stepTemplate.getParameters().stream()
                    .map(param -> JobParameterDTO.builder()
                            .name(param.getName())
                            .type(param.getType() != null ? param.getType().name() : null)
                            .required(param.getRequired())
                            .build())
                    .collect(Collectors.toList());
        }

        return StepTemplateVO.builder()
                .id(stepTemplate.getId())
                .name(stepTemplate.getName())
                .code(stepTemplate.getCode())
                .parameters(parameterDTOs)
                .overdueDays(stepTemplate.getOverdueDays())
                .description(stepTemplate.getDescription())
                .createTime(stepTemplate.getCreateTime() != null ? stepTemplate.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(stepTemplate.getUpdateTime() != null ? stepTemplate.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * 将 DTO 列表转换为 JobParameter 列表
     */
    private List<StepParameter> convertToJobParameters(List<JobParameterDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }
        return dtos.stream()
                .map(dto -> StepParameter.builder()
                        .name(dto.getName())
                        .type(ParameterType.valueOf(dto.getType()))
                        .required(dto.getRequired())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 将任务模版实体转换为VO
     */
    private TaskTemplateVO convertTaskTemplateToVO(TaskTemplate taskTemplate) {
        TaskTemplateVO vo = TaskTemplateVO.builder()
                .id(taskTemplate.getId())
                .name(taskTemplate.getName())
                .code(taskTemplate.getCode())
                .creator(taskTemplate.getCreator())
                .createTime(taskTemplate.getCreateTime())
                .updateTime(taskTemplate.getUpdateTime())
                .build();

        if (taskTemplate.getItems() != null) {
            List<TaskTemplateItemVO> itemVOs = taskTemplate.getItems().stream()
                    .map(this::convertTaskTemplateItemToVO)
                    .collect(Collectors.toList());
            vo.setItems(itemVOs);
        }

        return vo;
    }

    /**
     * 将任务模版项目实体转换为VO
     */
    private TaskTemplateItemVO convertTaskTemplateItemToVO(TaskTemplateItem item) {
        TaskTemplateItemVO vo = TaskTemplateItemVO.builder()
                .id(item.getId())
                .taskTemplateId(item.getTaskTemplateId())
                .stepTemplateId(item.getStepTemplateId())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .createTime(item.getCreateTime())
                .updateTime(item.getUpdateTime())
                .build();

        if (item.getStepTemplate() != null) {
            vo.setStepTemplate(convertToVO(item.getStepTemplate()));
        }

        return vo;
    }

    // ========== 站点任务调度管理 ==========

    /**
     * 配置站点任务调度
     */
    @PostMapping("/site-task-schedulers")
    public Response<TaskSchedulerVO> configureTaskScheduler(@Valid @RequestBody ConfigureTaskSchedulerRequest request) {
        User currentUser = ThreadLocalUtil.getUser();
        String operator = currentUser.getName();

        // 获取站点
        Site site = siteDomainService.getSiteById(request.getSiteId()).orElse(null);
        if (site == null) {
            return Response.error("站点不存在");
        }

        // 获取任务模版
        TaskTemplate taskTemplate = maintenanceApplicationService.getTaskTemplate(request.getTaskTemplateId());

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

        TaskScheduler taskScheduler = maintenanceApplicationService.configureTaskScheduler(
                site, periodConfig, taskTemplate, department, operator);

        return Response.success(convertTaskSchedulerToVO(taskScheduler));
    }

    /**
     * 根据站点ID获取任务调度
     */
    @GetMapping("/site-task-schedulers/site/{siteId}")
    public Response<TaskSchedulerVO> getTaskSchedulerBySiteId(@PathVariable Integer siteId) {
        try {
            TaskScheduler taskScheduler = maintenanceApplicationService.getTaskSchedulerBySiteIdWithDetails(siteId);
            if (taskScheduler == null) {
                return Response.success(null);
            }
            return Response.success(convertTaskSchedulerToVO(taskScheduler));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有站点任务调度
     */
    @GetMapping("/site-task-schedulers/all")
    public Response<List<TaskSchedulerVO>> getAllTaskSchedulers() {
        try {
            List<TaskScheduler> schedulers = maintenanceApplicationService.getAllTaskSchedulers();
            List<TaskSchedulerVO> voList = schedulers.stream()
                    .map(this::convertTaskSchedulerToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页查询站点任务调度
     *
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param siteName 站点名称（模糊查询）
     * @param enterpriseId 企业ID
     * @param siteId 站点ID
     * @param departmentId 运维小组（部门ID）
     * @return 分页结果
     */
    @GetMapping("/site-task-schedulers")
    public Response<PageResult<TaskSchedulerVO>> getTaskSchedulerPage(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteName,
            @RequestParam(required = false) Integer enterpriseId,
            @RequestParam(required = false) Integer siteId,
            @RequestParam(required = false) Integer departmentId) {
        try {
            IPage<TaskScheduler> page = maintenanceApplicationService.getTaskSchedulerPage(
                    pageNum, pageSize, siteName, enterpriseId, siteId, departmentId);

            List<TaskSchedulerVO> voList = page.getRecords().stream()
                    .map(this::convertTaskSchedulerToVO)
                    .collect(Collectors.toList());

            PageResult<TaskSchedulerVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除站点任务调度
     */
    @DeleteMapping("/site-task-schedulers/{id}")
    public Response<Void> deleteTaskScheduler(@PathVariable Integer id) {
        try {
            maintenanceApplicationService.deleteTaskScheduler(id);
            return Response.success(null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页查询站点及其任务调度
     */
    @GetMapping("/sites-with-task-schedulers")
    public Response<PageResult<SiteWithTaskSchedulerVO>> getSitesWithTaskSchedulers(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteType,
            @RequestParam(required = false) Integer enterpriseId) {
        try {
            // 获取站点分页列表
            IPage<Site> page = siteDomainService.getSitePage(pageNum, pageSize, siteType, enterpriseId);

            // 转换为带任务调度的VO列表
            List<SiteWithTaskSchedulerVO> voList = page.getRecords().stream()
                    .map(site -> {
                        SiteWithTaskSchedulerVO vo = convertSiteToWithTaskSchedulerVO(site);

                        // 查询该站点的任务调度
                        try {
                            TaskScheduler taskScheduler = maintenanceApplicationService.getTaskSchedulerBySiteIdWithDetails(site.getId());
                            if (taskScheduler != null) {
                                fillTaskSchedulerInfo(vo, taskScheduler);
                            }
                        } catch (Exception e) {
                            // 站点没有任务调度，忽略
                        }

                        return vo;
                    })
                    .collect(Collectors.toList());

            PageResult<SiteWithTaskSchedulerVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);

            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将站点实体转换为SiteWithTaskSchedulerVO
     */
    private SiteWithTaskSchedulerVO convertSiteToWithTaskSchedulerVO(Site site) {
        return SiteWithTaskSchedulerVO.builder()
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
     * 填充任务调度信息到VO
     */
    private void fillTaskSchedulerInfo(SiteWithTaskSchedulerVO vo, TaskScheduler taskScheduler) {
        vo.setTaskSchedulerId(taskScheduler.getId());
        vo.setTaskSchedulerState(taskScheduler.getTaskSchedulerState() != null ? taskScheduler.getTaskSchedulerState().getDescription() : null);
        vo.setTaskSchedulerCreator(taskScheduler.getCreator());
        vo.setTaskSchedulerCreateTime(taskScheduler.getCreateTime() != null ? taskScheduler.getCreateTime().format(DATE_FORMATTER) : null);
        vo.setTaskSchedulerUpdater(taskScheduler.getUpdater());
        vo.setTaskSchedulerUpdateTime(taskScheduler.getUpdateTime() != null ? taskScheduler.getUpdateTime().format(DATE_FORMATTER) : null);

        // 部门信息
        if (taskScheduler.getDepartment() != null) {
            vo.setDepartmentId(taskScheduler.getDepartment().getId());
            vo.setDepartmentName(taskScheduler.getDepartment().getName());
        }

        // 任务模版信息
        if (taskScheduler.getTaskTemplate() != null) {
            vo.setTaskTemplateId(taskScheduler.getTaskTemplate().getId());
            vo.setTaskTemplateName(taskScheduler.getTaskTemplate().getName());
            vo.setTaskTemplateCode(taskScheduler.getTaskTemplate().getCode());
        }

        // 周期配置
        if (taskScheduler.getPeriodConfig() != null && taskScheduler.getPeriodConfig().getPertioType() != null) {
            SiteWithTaskSchedulerVO.PeriodConfigVO periodConfigVO = SiteWithTaskSchedulerVO.PeriodConfigVO.builder()
                    .periodType(taskScheduler.getPeriodConfig().getPertioType().name())
                    .n(taskScheduler.getPeriodConfig().getN())
                    .build();
            vo.setPeriodConfig(periodConfigVO);
        }
    }

    /**
     * 将站点任务调度实体转换为VO
     */
    private TaskSchedulerVO convertTaskSchedulerToVO(TaskScheduler taskScheduler) {
        TaskSchedulerVO vo = TaskSchedulerVO.builder()
                .id(taskScheduler.getId())
                .taskSchedulerState(taskScheduler.getTaskSchedulerState() != null ? taskScheduler.getTaskSchedulerState().getDescription() : null)
                .creator(taskScheduler.getCreator())
                .createTime(taskScheduler.getCreateTime())
                .updater(taskScheduler.getUpdater())
                .updateTime(taskScheduler.getUpdateTime())
                .build();

        // 周期配置
        if (taskScheduler.getPeriodConfig() != null && taskScheduler.getPeriodConfig().getPertioType() != null) {
            TaskSchedulerVO.PeriodConfigVO periodConfigVO = TaskSchedulerVO.PeriodConfigVO.builder()
                    .periodType(taskScheduler.getPeriodConfig().getPertioType().name())
                    .n(taskScheduler.getPeriodConfig().getN())
                    .build();
            vo.setPeriodConfig(periodConfigVO);
        }

        // 站点信息
        if (taskScheduler.getSite() != null) {
            vo.setSiteId(taskScheduler.getSite().getId());
            vo.setSiteName(taskScheduler.getSite().getSiteName());
            vo.setSiteCode(taskScheduler.getSite().getSiteCode());

            // 企业信息
            if (taskScheduler.getSite().getEnterprise() != null) {
                vo.setEnterpriseId(taskScheduler.getSite().getEnterprise().getId());
                vo.setEnterpriseName(taskScheduler.getSite().getEnterprise().getEnterpriseName());
            }
        }

        // 任务模版信息
        if (taskScheduler.getTaskTemplate() != null) {
            vo.setTaskTemplateId(taskScheduler.getTaskTemplate().getId());
            vo.setTaskTemplateName(taskScheduler.getTaskTemplate().getName());
        }

        // 部门信息
        if (taskScheduler.getDepartment() != null) {
            vo.setDepartmentId(taskScheduler.getDepartment().getId());
            vo.setDepartmentName(taskScheduler.getDepartment().getName());
        }

        return vo;
    }

    // ========== 任务查询接口 ==========

    /**
     * 分页查询任务
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
    @GetMapping("/task")
    public Response<PageResult<TaskVO>> getTaskPage(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") java.time.LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") java.time.LocalDateTime endTime,
            @RequestParam(required = false) String creator,
            @RequestParam(required = false) Integer departmentId) {
        try {
            IPage<com.aquainsight.domain.maintenance.entity.Task> page =
                    maintenanceApplicationService.getTaskPage(
                            pageNum, pageSize, siteName, status, startTime, endTime, creator, departmentId);

            List<TaskVO> voList = page.getRecords().stream()
                    .map(this::convertTaskToVO)
                    .collect(Collectors.toList());

            PageResult<TaskVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将站点任务实体转换为VO
     */
    private TaskVO convertTaskToVO(com.aquainsight.domain.maintenance.entity.Task instance) {
        TaskVO vo = TaskVO.builder()
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

        // 填充任务调度ID（仅作为标记）
        vo.setTaskSchedulerId(instance.getTaskSchedulerId());

        // 填充站点信息（直接从任务获取）
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

        // 填充任务模版信息（直接从任务获取）
        if (instance.getTaskTemplate() != null) {
            vo.setTaskTemplateId(instance.getTaskTemplate().getId());
            vo.setTaskTemplateName(instance.getTaskTemplate().getName());

            // 计算任务项量
            if (instance.getTaskTemplate().getItems() != null) {
                vo.setTaskItemCount(instance.getTaskTemplate().getItems().size());
            } else {
                vo.setTaskItemCount(0);
            }
        }

        // 填充部门信息（直接从任务获取）
        if (instance.getDepartment() != null) {
            vo.setDepartmentId(instance.getDepartment().getId());
            vo.setDepartmentName(instance.getDepartment().getName());
        }

        return vo;
    }

    // ========== 任务补齐接口 ==========

    /**
     * 补齐任务
     * 根据任务调度和时间范围，自动补齐缺失的任务
     */
    @PostMapping("/task/backfill")
    public Response<BackfillResultVO> backfillTask(@Valid @RequestBody BackfillTaskRequest request) {
        try {
            // 获取当前用户
            User currentUser = ThreadLocalUtil.getUser();

            // 调用应用服务补齐任务
            List<com.aquainsight.domain.maintenance.entity.Task> backfilledInstances =
                    maintenanceApplicationService.backfillTaskForScheduler(
                            request.getTaskSchedulerId(),
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
            return Response.error("补齐任务失败: " + e.getMessage());
        }
    }

    /**
     * 手动创建任务
     * 根据站点、任务模版、部门信息创建一个任务（触发时间为当前时间）
     */
    @PostMapping("/task")
    public Response<TaskVO> createManualJobInstance(@Valid @RequestBody CreateManualJobInstanceRequest request) {
        try {
            // 获取当前用户
            User currentUser = ThreadLocalUtil.getUser();

            // 调用应用服务创建任务
            com.aquainsight.domain.maintenance.entity.Task instance =
                    maintenanceApplicationService.createManualJobInstance(
                            request.getSiteId(),
                            request.getTaskTemplateId(),
                            request.getDepartmentId(),
                            currentUser.getName()
                    );

            // 转换为VO
            TaskVO vo = convertTaskToVO(instance);

            return Response.success(vo);

        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        } catch (Exception e) {
            return Response.error("创建任务失败: " + e.getMessage());
        }
    }
}
