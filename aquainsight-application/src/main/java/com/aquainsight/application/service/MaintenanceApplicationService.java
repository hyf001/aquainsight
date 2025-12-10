package com.aquainsight.application.service;

import com.aquainsight.domain.maintenance.entity.StepTemplate;
import com.aquainsight.domain.maintenance.entity.TaskTemplate;
import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;
import com.aquainsight.domain.maintenance.entity.Task;
import com.aquainsight.domain.maintenance.entity.TaskScheduler;
import com.aquainsight.domain.maintenance.repository.TaskSchedulerRepository;
import com.aquainsight.domain.maintenance.service.StepTemplateDomainService;
import com.aquainsight.domain.maintenance.service.TaskTemplateDomainService;
import com.aquainsight.domain.maintenance.service.TaskDomainService;
import com.aquainsight.domain.maintenance.service.TaskSchedulerDomainService;
import com.aquainsight.domain.maintenance.types.StepParameter;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.service.DepartmentDomainService;
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

    private final StepTemplateDomainService stepTemplateDomainService;
    private final TaskTemplateDomainService taskTemplateDomainService;
    private final TaskSchedulerDomainService taskSchedulerDomainService;
    private final TaskDomainService taskDomainService;
    private final TaskSchedulerRepository taskSchedulerRepository;
    private final SiteRepository siteRepository;
    private final DepartmentDomainService departmentDomainService;

    /**
     * 创建步骤模版
     */
    @Transactional(rollbackFor = Exception.class)
    public StepTemplate createStepTemplate(String name, String code, List<StepParameter> parameters,
                                        Integer overdueDays, String description) {
        return stepTemplateDomainService.createStepTemplate(name, code, parameters, overdueDays, description);
    }

    /**
     * 更新步骤模版
     */
    @Transactional(rollbackFor = Exception.class)
    public StepTemplate updateStepTemplate(Integer id, String name, List<StepParameter> parameters,
                                        Integer overdueDays, String description) {
        return stepTemplateDomainService.updateStepTemplateInfo(id, name, parameters, overdueDays, description);
    }

    /**
     * 获取步骤模版详情
     */
    public StepTemplate getStepTemplate(Integer id) {
        return stepTemplateDomainService.getStepTemplateById(id);
    }

    /**
     * 获取所有步骤模版
     */
    public List<StepTemplate> getAllJobCategories() {
        return stepTemplateDomainService.getAllJobCategories();
    }

    /**
     * 搜索步骤模版
     */
    public List<StepTemplate> searchJobCategories(String name) {
        return stepTemplateDomainService.searchJobCategoriesByName(name);
    }

    /**
     * 删除步骤模版
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteStepTemplate(Integer id) {
        stepTemplateDomainService.deleteStepTemplate(id);
    }

    /**
     * 批量删除步骤模版
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteJobCategories(List<Integer> ids) {
        stepTemplateDomainService.deleteJobCategories(ids);
    }

    // ========== 任务模版管理 ==========

    /**
     * 创建任务模版
     */
    @Transactional(rollbackFor = Exception.class)
    public TaskTemplate createTaskTemplate(String name, String code, String creator) {
        return taskTemplateDomainService.createTaskTemplate(name, code, creator);
    }

    /**
     * 更新任务模版
     */
    @Transactional(rollbackFor = Exception.class)
    public TaskTemplate updateTaskTemplate(Integer id, String name, String updater) {
        return taskTemplateDomainService.updateTaskTemplateInfo(id, name, updater);
    }

    /**
     * 获取任务模版详情
     */
    public TaskTemplate getTaskTemplate(Integer id) {
        return taskTemplateDomainService.getTaskTemplateById(id);
    }

    /**
     * 获取任务模版详情（包含任务模版项目）
     */
    public TaskTemplate getTaskTemplateWithItems(Integer id) {
        return taskTemplateDomainService.getTaskTemplateByIdWithItems(id);
    }

    /**
     * 获取所有任务模版
     */
    public List<TaskTemplate> getAllTaskTemplates() {
        return taskTemplateDomainService.getAllTaskTemplates();
    }

    /**
     * 搜索任务模版
     */
    public List<TaskTemplate> searchTaskTemplates(String name) {
        return taskTemplateDomainService.searchTaskTemplatesByName(name);
    }

    /**
     * 删除任务模版
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTaskTemplate(Integer id) {
        taskTemplateDomainService.deleteTaskTemplate(id);
    }

    /**
     * 批量删除任务模版
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTaskTemplates(List<Integer> ids) {
        taskTemplateDomainService.deleteTaskTemplates(ids);
    }

    /**
     * 添加任务模版项目
     */
    @Transactional(rollbackFor = Exception.class)
    public TaskTemplateItem addTaskTemplateItem(Integer taskTemplateId, TaskTemplateItem taskTemplateItem) {
        return taskTemplateDomainService.addTaskTemplateItem(taskTemplateId, taskTemplateItem);
    }

    /**
     * 更新任务模版项目
     */
    @Transactional(rollbackFor = Exception.class)
    public TaskTemplateItem updateTaskTemplateItem(TaskTemplateItem taskTemplateItem) {
        return taskTemplateDomainService.updateTaskTemplateItem(taskTemplateItem);
    }

    /**
     * 删除任务模版项目
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTaskTemplateItem(Integer taskTemplateItemId) {
        taskTemplateDomainService.deleteTaskTemplateItem(taskTemplateItemId);
    }

    /**
     * 获取任务模版的所有项目
     */
    public List<TaskTemplateItem> getTaskTemplateItems(Integer taskTemplateId) {
        return taskTemplateDomainService.getTaskTemplateItems(taskTemplateId);
    }

    // ========== 站点任务调度管理 ==========

    /**
     * 配置站点任务调度
     * 一个站点只能有一个任务调度，如果已存在则更新
     */
    @Transactional(rollbackFor = Exception.class)
    public TaskScheduler configureTaskScheduler(Site site, PeriodConfig periodConfig, TaskTemplate taskTemplate,
                                             Department department, String operator) {
        return taskSchedulerDomainService.saveOrUpdateBySiteId(site, periodConfig, taskTemplate, department, operator);
    }

    /**
     * 根据站点ID获取任务调度
     */
    public TaskScheduler getTaskSchedulerBySiteId(Integer siteId) {
        return taskSchedulerDomainService.getPlanBySiteId(siteId);
    }

    /**
     * 根据站点ID获取任务调度（包含详情）
     */
    public TaskScheduler getTaskSchedulerBySiteIdWithDetails(Integer siteId) {
        return taskSchedulerDomainService.getPlanBySiteIdWithDetails(siteId);
    }

    /**
     * 获取所有站点任务调度
     */
    public List<TaskScheduler> getAllTaskSchedulers() {
        return taskSchedulerDomainService.getAllPlans();
    }

    /**
     * 删除站点任务调度
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTaskScheduler(Integer planId) {
        taskSchedulerDomainService.deletePlan(planId);
    }

    /**
     * 根据站点ID删除任务调度
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTaskSchedulerBySiteId(Integer siteId) {
        taskSchedulerDomainService.deleteBySiteId(siteId);
    }

    /**
     * 分页查询站点任务调度
     *
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param siteName 站点名称（模糊查询）
     * @param enterpriseId 企业ID（查询该企业下所有站点的任务调度）
     * @param siteId 站点ID（精确查询）
     * @param departmentId 部门ID（运维小组）
     * @return 分页结果
     */
    public IPage<TaskScheduler> getTaskSchedulerPage(Integer pageNum, Integer pageSize,
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

        return taskSchedulerRepository.findPageWithDetails(pageNum, pageSize, siteName, siteIds, departmentId);
    }

    // ========== 定时任务相关 ==========

    /**
     * 生成所有启用中的任务调度的下一周期实例
     * 供定时任务调用
     *
     * @param creator 创建人（通常是"SYSTEM"）
     * @return 成功生成的任务列表
     */
    @Transactional(rollbackFor = Exception.class)
    public List<Task> generateNextInstancesForAllActivePlans(String creator) {
        // 查询所有启用中的任务调度
        List<TaskScheduler> activeTaskSchedulers = taskSchedulerRepository.findActiveTaskSchedulersWithDetails();

        List<Task> generatedInstances = new ArrayList<>();

        for (TaskScheduler taskScheduler : activeTaskSchedulers) {
            try {
                // 为每个计划生成下一周期的任务
                Task instance = taskDomainService.generateNextInstanceForPlan(taskScheduler, creator);
                generatedInstances.add(instance);
            } catch (IllegalArgumentException e) {
                // 任务已存在或其他业务异常，跳过
                // 这里不抛出异常，继续处理其他计划
            }
        }

        return generatedInstances;
    }

    /**
     * 检查并标记所有逾期的任务
     * 供定时任务调用
     */
    @Transactional(rollbackFor = Exception.class)
    public void checkAndMarkAllOverdueInstances() {
        taskDomainService.checkAndMarkOverdueInstances();
    }

    /**
     * 检查并更新所有任务的过期状态（即将过期和已逾期）
     * 供定时任务调用
     *
     * @param expiringThresholdHours 即将过期的阈值（小时数）
     */
    @Transactional(rollbackFor = Exception.class)
    public void checkAndUpdateExpirationStatus(int expiringThresholdHours) {
        taskDomainService.checkAndUpdateExpirationStatus(expiringThresholdHours);
    }

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
    public IPage<Task> getTaskPage(Integer pageNum, Integer pageSize,
                                                          String siteName, String status,
                                                          java.time.LocalDateTime startTime,
                                                          java.time.LocalDateTime endTime,
                                                          String creator, Integer departmentId) {
        return taskDomainService.getInstancePage(
                pageNum, pageSize, siteName, status, startTime, endTime, creator, departmentId);
    }

    /**
     * 根据任务调度补齐指定时间范围内缺失的任务
     *
     * @param taskSchedulerId 任务调度ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param operator 操作人
     * @return 补齐的任务列表
     */
    @Transactional(rollbackFor = Exception.class)
    public List<Task> backfillTaskForScheduler(Integer taskSchedulerId,
                                                              java.time.LocalDateTime startTime,
                                                              java.time.LocalDateTime endTime,
                                                              String operator) {
        // 查询任务调度（包含关联信息）
        TaskScheduler taskScheduler = taskSchedulerDomainService.getPlanByIdWithDetails(taskSchedulerId);

        if (taskScheduler == null) {
            throw new IllegalArgumentException("任务调度不存在");
        }

        // 调用领域服务补齐任务
        return taskDomainService.backfillInstancesForPlan(
                taskScheduler, startTime, endTime, operator);
    }

    /**
     * 手动创建任务
     * 根据站点、任务模版、部门信息直接创建一个任务（不依赖任务调度，触发时间为当前时间）
     *
     * @param siteId 站点ID
     * @param taskTemplateId 任务模版ID
     * @param departmentId 部门ID
     * @param creator 创建人
     * @return 创建的任务
     */
    @Transactional(rollbackFor = Exception.class)
    public Task createManualJobInstance(Integer siteId, Integer taskTemplateId, Integer departmentId,
                                                    String creator) {
        // 查询站点
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new IllegalArgumentException("站点不存在"));

        // 查询任务模版（包含任务模版项）
        TaskTemplate taskTemplate = taskTemplateDomainService.getTaskTemplateByIdWithItems(taskTemplateId);
        if (taskTemplate == null) {
            throw new IllegalArgumentException("任务模版不存在");
        }

        // 查询部门
        Department department = departmentDomainService.getDepartmentById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("部门不存在"));

        // 触发时间为当前时间
        java.time.LocalDateTime triggerTime = java.time.LocalDateTime.now();

        // 计算过期时间（根据任务模版中步骤模版的最大逾期天数）
        int maxOverdueDays = 7; // 默认7天
        if (taskTemplate.getItems() != null && !taskTemplate.getItems().isEmpty()) {
            maxOverdueDays = taskTemplate.getItems().stream()
                    .filter(item -> item.getStepTemplate() != null && item.getStepTemplate().getOverdueDays() != null)
                    .mapToInt(item -> item.getStepTemplate().getOverdueDays())
                    .max()
                    .orElse(7);
        }
        java.time.LocalDateTime expiredTime = triggerTime.plusDays(maxOverdueDays);

        // 检查是否已存在相同站点在相同时间的任务
        Task existingInstance = taskDomainService.getInstanceBySiteIdAndTriggerTime(siteId, triggerTime);
        if (existingInstance != null) {
            throw new IllegalArgumentException("该站点在该时间点的任务已存在");
        }

        // 直接创建任务，不依赖任务调度
        Task instance = Task.builder()
                .siteId(siteId)
                .site(site)
                .taskTemplateId(taskTemplateId)
                .taskTemplate(taskTemplate)
                .departmentId(departmentId)
                .department(department)
                .taskSchedulerId(null) // 手动创建的任务不关联任务调度
                .triggerTime(triggerTime)
                .status(com.aquainsight.domain.maintenance.types.TaskStatus.PENDING)
                .expiredTime(expiredTime)
                .creator(creator)
                .createTime(java.time.LocalDateTime.now())
                .updateTime(java.time.LocalDateTime.now())
                .deleted(0)
                .build();

        return taskDomainService.saveInstance(instance);
    }
}
