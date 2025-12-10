package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.Task;
import com.aquainsight.domain.maintenance.entity.TaskScheduler;
import com.aquainsight.domain.maintenance.repository.TaskRepository;
import com.aquainsight.domain.maintenance.types.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 站点任务领域服务
 */
@Service
@RequiredArgsConstructor
public class TaskDomainService {

    private final TaskRepository taskRepository;

    /**
     * 根据任务调度生成任务
     */
    public Task generateInstance(TaskScheduler taskScheduler, LocalDateTime triggerTime, String creator) {
        if (taskScheduler == null) {
            throw new IllegalArgumentException("任务调度不能为空");
        }
        if (triggerTime == null) {
            throw new IllegalArgumentException("派发时间不能为空");
        }
        if (taskScheduler.getSite() == null) {
            throw new IllegalArgumentException("任务调度必须关联站点");
        }
        if (taskScheduler.getTaskTemplate() == null) {
            throw new IllegalArgumentException("任务调度必须关联任务模版");
        }
        if (taskScheduler.getDepartment() == null) {
            throw new IllegalArgumentException("任务调度必须关联部门");
        }

        // 检查是否已经存在相同站点在相同时间的任务
        Task existingInstance = taskRepository
                .findBySiteIdAndTriggerTime(taskScheduler.getSite().getId(), triggerTime);
        if (existingInstance != null) {
            throw new IllegalArgumentException("该站点在该时间点的任务已存在");
        }

        // 计算过期时间（根据步骤模版的逾期天数）
        LocalDateTime expiredTime = calculateExpiredTime(taskScheduler, triggerTime);

        Task instance = Task.builder()
                .siteId(taskScheduler.getSite().getId())
                .site(taskScheduler.getSite())
                .taskTemplateId(taskScheduler.getTaskTemplate().getId())
                .taskTemplate(taskScheduler.getTaskTemplate())
                .departmentId(taskScheduler.getDepartment().getId())
                .department(taskScheduler.getDepartment())
                .taskSchedulerId(taskScheduler.getId())  // 仅作为标记，表示从计划生成
                .triggerTime(triggerTime)
                .status(TaskStatus.PENDING)
                .expiredTime(expiredTime)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return taskRepository.save(instance);
    }

    /**
     * 批量生成任务
     */
    public List<Task> batchGenerateInstances(TaskScheduler taskScheduler,
                                                        List<LocalDateTime> triggerTimes,
                                                        String creator) {
        if (taskScheduler == null) {
            throw new IllegalArgumentException("任务调度不能为空");
        }
        if (triggerTimes == null || triggerTimes.isEmpty()) {
            throw new IllegalArgumentException("派发时间列表不能为空");
        }

        return triggerTimes.stream()
                .map(triggerTime -> {
                    try {
                        return generateInstance(taskScheduler, triggerTime, creator);
                    } catch (IllegalArgumentException e) {
                        // 如果已存在，则跳过
                        return null;
                    }
                })
                .filter(instance -> instance != null)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 开始任务
     */
    public Task startInstance(Integer instanceId, String operator) {
        Task instance = taskRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务不存在");
        }

        instance.start(operator);
        return taskRepository.save(instance);
    }

    /**
     * 完成任务
     */
    public Task completeInstance(Integer instanceId) {
        Task instance = taskRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务不存在");
        }

        instance.complete();
        return taskRepository.save(instance);
    }

    /**
     * 取消任务
     */
    public Task cancelInstance(Integer instanceId) {
        Task instance = taskRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务不存在");
        }

        instance.cancel();
        return taskRepository.save(instance);
    }

    /**
     * 更新任务处理人
     */
    public Task updateOperator(Integer instanceId, String operator) {
        Task instance = taskRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务不存在");
        }

        instance.updateOperator(operator);
        return taskRepository.save(instance);
    }

    /**
     * 检查并标记逾期任务
     */
    public void checkAndMarkOverdueInstances() {
        LocalDateTime now = LocalDateTime.now();
        List<Task> overdueInstances = taskRepository.findInstancesToCheckOverdue(now);

        for (Task instance : overdueInstances) {
            instance.checkAndMarkOverdue();
            taskRepository.save(instance);
        }
    }

    /**
     * 检查并更新所有任务的过期状态（即将过期和已逾期）
     *
     * @param expiringThresholdHours 即将过期的阈值（小时数）
     */
    public void checkAndUpdateExpirationStatus(int expiringThresholdHours) {
        LocalDateTime now = LocalDateTime.now();
        List<Task> instancesToCheck = taskRepository.findInstancesToCheckOverdue(now.plusHours(expiringThresholdHours));

        for (Task instance : instancesToCheck) {
            instance.checkAndUpdateExpirationStatus(expiringThresholdHours);
            taskRepository.save(instance);
        }
    }

    /**
     * 保存任务
     */
    public Task saveInstance(Task instance) {
        return taskRepository.save(instance);
    }

    /**
     * 根据站点ID和触发时间获取任务
     */
    public Task getInstanceBySiteIdAndTriggerTime(Integer siteId, LocalDateTime triggerTime) {
        return taskRepository.findBySiteIdAndTriggerTime(siteId, triggerTime);
    }

    /**
     * 根据ID获取任务
     */
    public Task getInstanceById(Integer instanceId) {
        return taskRepository.findById(instanceId);
    }

    /**
     * 根据ID获取任务（包含计划详情）
     */
    public Task getInstanceByIdWithPlan(Integer instanceId) {
        return taskRepository.findByIdWithPlan(instanceId);
    }

    /**
     * 根据任务调度ID获取所有任务
     */
    public List<Task> getInstancesByPlanId(Integer planId) {
        return taskRepository.findByTaskSchedulerId(planId);
    }

    /**
     * 根据状态获取任务
     */
    public List<Task> getInstancesByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    /**
     * 根据处理人获取任务
     */
    public List<Task> getInstancesByOperator(String operator) {
        return taskRepository.findByOperator(operator);
    }

    /**
     * 获取待处理的任务
     */
    public List<Task> getPendingInstances() {
        return taskRepository.findPendingInstances();
    }

    /**
     * 获取进行中的任务
     */
    public List<Task> getInProgressInstances() {
        return taskRepository.findInProgressInstances();
    }

    /**
     * 根据站点ID获取任务
     */
    public List<Task> getInstancesBySiteId(Integer siteId) {
        return taskRepository.findBySiteId(siteId);
    }

    /**
     * 根据时间范围获取任务
     */
    public List<Task> getInstancesByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return taskRepository.findByTriggerTimeRange(startTime, endTime);
    }

    /**
     * 删除任务
     */
    public void deleteInstance(Integer instanceId) {
        Task instance = taskRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务不存在");
        }
        taskRepository.deleteById(instanceId);
    }

    /**
     * 批量删除任务
     */
    public void deleteInstances(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        taskRepository.deleteByIds(ids);
    }

    /**
     * 根据任务调度生成下一周期的任务
     * 用于定时任务周期性调用
     */
    public Task generateNextInstanceForPlan(TaskScheduler taskScheduler, String creator) {
        if (taskScheduler == null) {
            throw new IllegalArgumentException("任务调度不能为空");
        }

        // 查询该计划的最后一个任务
        List<Task> instances = taskRepository.findByTaskSchedulerId(taskScheduler.getId());

        LocalDateTime triggerTime;
        if (instances.isEmpty()) {
            // 如果没有任务，使用当前时间作为第一次派发时间
            triggerTime = LocalDateTime.now();
        } else {
            // 找到最后一个任务的派发时间
            LocalDateTime lastTriggerTime = instances.stream()
                    .map(Task::getTriggerTime)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.now());

            // 根据周期配置计算下一次派发时间
            triggerTime = taskScheduler.calculateNextMaintenanceTime(lastTriggerTime);

            if (triggerTime == null) {
                throw new IllegalStateException("无法计算下一次维护时间，请检查周期配置");
            }
        }

        // 生成任务
        return generateInstance(taskScheduler, triggerTime, creator);
    }

    /**
     * 根据任务调度和时间范围补齐缺失的任务
     *
     * @param taskScheduler 任务调度
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param creator 创建人
     * @return 补齐的任务列表
     */
    public List<Task> backfillInstancesForPlan(TaskScheduler taskScheduler,
                                                           LocalDateTime startTime,
                                                           LocalDateTime endTime,
                                                           String creator) {
        if (taskScheduler == null) {
            throw new IllegalArgumentException("任务调度不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("开始时间不能晚于结束时间");
        }
        if (taskScheduler.getPeriodConfig() == null) {
            throw new IllegalArgumentException("任务调度的周期配置不能为空");
        }

        List<Task> backfilledInstances = new ArrayList<>();

        // 计算该时间范围内应该存在的所有派发时间
        List<LocalDateTime> expectedTriggerTimes = calculateTriggerTimesInRange(
                taskScheduler, startTime, endTime);

        // 查询该计划已存在的任务
        List<Task> existingInstances =
                taskRepository.findByTaskSchedulerId(taskScheduler.getId());

        // 提取已存在实例的派发时间
        java.util.Set<LocalDateTime> existingTriggerTimes = existingInstances.stream()
                .map(Task::getTriggerTime)
                .collect(java.util.stream.Collectors.toSet());

        // 补齐缺失的任务
        for (LocalDateTime triggerTime : expectedTriggerTimes) {
            // 检查该派发时间的实例是否已存在
            if (!existingTriggerTimes.contains(triggerTime)) {
                try {
                    Task instance = generateInstance(taskScheduler, triggerTime, creator);
                    backfilledInstances.add(instance);
                } catch (IllegalArgumentException e) {
                    // 如果生成失败（比如已存在），跳过
                    continue;
                }
            }
        }

        return backfilledInstances;
    }

    /**
     * 计算指定时间范围内应该存在的所有派发时间
     *
     * @param taskScheduler 任务调度
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 派发时间列表
     */
    private List<LocalDateTime> calculateTriggerTimesInRange(TaskScheduler taskScheduler,
                                                              LocalDateTime startTime,
                                                              LocalDateTime endTime) {
        List<LocalDateTime> triggerTimes = new ArrayList<>();

        // 从开始时间开始计算第一个派发时间
        LocalDateTime currentTriggerTime = startTime;

        // 最多循环1000次，防止死循环
        int maxIterations = 1000;
        int iteration = 0;

        while (currentTriggerTime.isBefore(endTime) || currentTriggerTime.isEqual(endTime)) {
            if (iteration++ > maxIterations) {
                throw new IllegalStateException("计算派发时间超过最大迭代次数，请检查周期配置");
            }

            triggerTimes.add(currentTriggerTime);

            // 计算下一个派发时间
            LocalDateTime nextTriggerTime = taskScheduler.calculateNextMaintenanceTime(currentTriggerTime);

            if (nextTriggerTime == null) {
                break;
            }

            // 防止计算结果不向前推进导致死循环
            if (!nextTriggerTime.isAfter(currentTriggerTime)) {
                throw new IllegalStateException("周期配置异常：下一次维护时间不晚于当前时间");
            }

            currentTriggerTime = nextTriggerTime;
        }

        return triggerTimes;
    }

    /**
     * 计算任务过期时间
     * 根据任务模版中所有步骤模版的最大逾期天数计算
     */
    private LocalDateTime calculateExpiredTime(TaskScheduler taskScheduler, LocalDateTime triggerTime) {
        if (taskScheduler.getTaskTemplate() == null ||
            taskScheduler.getTaskTemplate().getItems() == null ||
            taskScheduler.getTaskTemplate().getItems().isEmpty()) {
            // 默认7天过期
            return triggerTime.plusDays(7);
        }

        // 获取所有任务模版项目中的最大逾期天数
        int maxOverdueDays = taskScheduler.getTaskTemplate().getItems().stream()
                .filter(item -> item.getStepTemplate() != null)
                .mapToInt(item -> item.getStepTemplate().getOverdueDays() != null
                        ? item.getStepTemplate().getOverdueDays()
                        : 0)
                .max()
                .orElse(7); // 默认7天

        return triggerTime.plusDays(maxOverdueDays);
    }

    /**
     * 分页查询任务
     */
    public com.baomidou.mybatisplus.core.metadata.IPage<Task> getInstancePage(
            Integer pageNum, Integer pageSize,
            String siteName, String status, LocalDateTime startTime, LocalDateTime endTime,
            String creator, Integer departmentId) {
        return taskRepository.findPageWithDetails(
                pageNum, pageSize, siteName, status, startTime, endTime, creator, departmentId);
    }
}
