package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.TaskTemplate;
import com.aquainsight.domain.maintenance.entity.TaskScheduler;
import com.aquainsight.domain.maintenance.repository.TaskSchedulerRepository;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.organization.entity.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务调度领域服务
 */
@Service
@RequiredArgsConstructor
public class TaskSchedulerDomainService {

    private final TaskSchedulerRepository taskSchedulerRepository;

    /**
     * 创建站点任务调度
     * 一个站点只能有一个任务调度
     */
    public TaskScheduler createPlan(Site site, PeriodConfig periodConfig, TaskTemplate taskTemplate,
                                   Department department, String creator) {
        if (site == null) {
            throw new IllegalArgumentException("站点不能为空");
        }

        // 检查站点是否已存在任务调度
        TaskScheduler existingPlan = taskSchedulerRepository.findBySiteId(site.getId());
        if (existingPlan != null) {
            throw new IllegalArgumentException("该站点已存在任务调度，一个站点只能有一个任务调度");
        }

        TaskScheduler plan = TaskScheduler.builder()
                .site(site)
                .periodConfig(periodConfig)
                .taskTemplate(taskTemplate)
                .department(department)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return taskSchedulerRepository.save(plan);
    }

    /**
     * 更新站点任务调度
     */
    public TaskScheduler updatePlan(Integer planId, PeriodConfig periodConfig, TaskTemplate taskTemplate,
                                   Department department, String updater) {
        TaskScheduler plan = taskSchedulerRepository.findById(planId);
        if (plan == null) {
            throw new IllegalArgumentException("任务调度不存在");
        }

        plan.updateInfo(periodConfig, taskTemplate, updater);
        if (department != null) {
            plan.setDepartment(department);
        }
        plan.setUpdateTime(LocalDateTime.now());

        return taskSchedulerRepository.save(plan);
    }

    /**
     * 根据站点ID更新或创建任务调度
     */
    public TaskScheduler saveOrUpdateBySiteId(Site site, PeriodConfig periodConfig, TaskTemplate taskTemplate,
                                             Department department, String operator) {
        TaskScheduler existingPlan = taskSchedulerRepository.findBySiteId(site.getId());

        if (existingPlan != null) {
            // 更新现有计划
            return updatePlan(existingPlan.getId(), periodConfig, taskTemplate, department, operator);
        } else {
            // 创建新计划
            return createPlan(site, periodConfig, taskTemplate, department, operator);
        }
    }

    /**
     * 根据ID获取任务调度
     */
    public TaskScheduler getPlanById(Integer planId) {
        return taskSchedulerRepository.findById(planId);
    }

    /**
     * 根据站点ID获取任务调度
     */
    public TaskScheduler getPlanBySiteId(Integer siteId) {
        return taskSchedulerRepository.findBySiteId(siteId);
    }

    /**
     * 根据ID获取任务调度（包含详情）
     */
    public TaskScheduler getPlanByIdWithDetails(Integer planId) {
        return taskSchedulerRepository.findByIdWithDetails(planId);
    }

    /**
     * 根据站点ID获取任务调度（包含详情）
     */
    public TaskScheduler getPlanBySiteIdWithDetails(Integer siteId) {
        return taskSchedulerRepository.findBySiteIdWithDetails(siteId);
    }

    /**
     * 获取所有任务调度
     */
    public List<TaskScheduler> getAllPlans() {
        return taskSchedulerRepository.findAll();
    }

    /**
     * 删除任务调度
     */
    public void deletePlan(Integer planId) {
        TaskScheduler plan = taskSchedulerRepository.findById(planId);
        if (plan == null) {
            throw new IllegalArgumentException("任务调度不存在");
        }
        taskSchedulerRepository.deleteById(planId);
    }

    /**
     * 批量删除任务调度
     */
    public void deletePlans(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        taskSchedulerRepository.deleteByIds(ids);
    }

    /**
     * 根据站点ID删除任务调度
     */
    public void deleteBySiteId(Integer siteId) {
        TaskScheduler plan = taskSchedulerRepository.findBySiteId(siteId);
        if (plan != null) {
            taskSchedulerRepository.deleteById(plan.getId());
        }
    }
}
