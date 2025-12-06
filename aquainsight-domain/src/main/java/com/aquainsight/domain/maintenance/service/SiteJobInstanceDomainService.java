package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 站点任务实例领域服务
 */
@Service
@RequiredArgsConstructor
public class SiteJobInstanceDomainService {

    private final SiteJobInstanceRepository siteJobInstanceRepository;

    /**
     * 根据任务计划生成任务实例
     */
    public SiteJobInstance generateInstance(SiteJobPlan siteJobPlan, LocalDateTime triggerTime, String creator) {
        if (siteJobPlan == null) {
            throw new IllegalArgumentException("任务计划不能为空");
        }
        if (triggerTime == null) {
            throw new IllegalArgumentException("派发时间不能为空");
        }

        // 检查是否已经存在相同的任务实例
        SiteJobInstance existingInstance = siteJobInstanceRepository
                .findBySiteJobPlanIdAndTriggerTime(siteJobPlan.getId(), triggerTime);
        if (existingInstance != null) {
            throw new IllegalArgumentException("该时间点的任务实例已存在");
        }

        // 计算过期时间（根据作业类别的逾期天数）
        LocalDateTime expiredTime = calculateExpiredTime(siteJobPlan, triggerTime);

        SiteJobInstance instance = SiteJobInstance.builder()
                .siteJobPlan(siteJobPlan)
                .triggerTime(triggerTime)
                .status(JobInstanceStatus.PENDING)
                .expiredTime(expiredTime)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return siteJobInstanceRepository.save(instance);
    }

    /**
     * 批量生成任务实例
     */
    public List<SiteJobInstance> batchGenerateInstances(SiteJobPlan siteJobPlan,
                                                        List<LocalDateTime> triggerTimes,
                                                        String creator) {
        if (siteJobPlan == null) {
            throw new IllegalArgumentException("任务计划不能为空");
        }
        if (triggerTimes == null || triggerTimes.isEmpty()) {
            throw new IllegalArgumentException("派发时间列表不能为空");
        }

        return triggerTimes.stream()
                .map(triggerTime -> {
                    try {
                        return generateInstance(siteJobPlan, triggerTime, creator);
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
    public SiteJobInstance startInstance(Integer instanceId, String operator) {
        SiteJobInstance instance = siteJobInstanceRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务实例不存在");
        }

        instance.start(operator);
        return siteJobInstanceRepository.save(instance);
    }

    /**
     * 完成任务
     */
    public SiteJobInstance completeInstance(Integer instanceId) {
        SiteJobInstance instance = siteJobInstanceRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务实例不存在");
        }

        instance.complete();
        return siteJobInstanceRepository.save(instance);
    }

    /**
     * 取消任务
     */
    public SiteJobInstance cancelInstance(Integer instanceId) {
        SiteJobInstance instance = siteJobInstanceRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务实例不存在");
        }

        instance.cancel();
        return siteJobInstanceRepository.save(instance);
    }

    /**
     * 更新任务处理人
     */
    public SiteJobInstance updateOperator(Integer instanceId, String operator) {
        SiteJobInstance instance = siteJobInstanceRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务实例不存在");
        }

        instance.updateOperator(operator);
        return siteJobInstanceRepository.save(instance);
    }

    /**
     * 检查并标记逾期任务
     */
    public void checkAndMarkOverdueInstances() {
        LocalDateTime now = LocalDateTime.now();
        List<SiteJobInstance> overdueInstances = siteJobInstanceRepository.findInstancesToCheckOverdue(now);

        for (SiteJobInstance instance : overdueInstances) {
            instance.checkAndMarkOverdue();
            siteJobInstanceRepository.save(instance);
        }
    }

    /**
     * 检查并更新所有任务的过期状态（即将过期和已逾期）
     *
     * @param expiringThresholdHours 即将过期的阈值（小时数）
     */
    public void checkAndUpdateExpirationStatus(int expiringThresholdHours) {
        LocalDateTime now = LocalDateTime.now();
        List<SiteJobInstance> instancesToCheck = siteJobInstanceRepository.findInstancesToCheckOverdue(now.plusHours(expiringThresholdHours));

        for (SiteJobInstance instance : instancesToCheck) {
            instance.checkAndUpdateExpirationStatus(expiringThresholdHours);
            siteJobInstanceRepository.save(instance);
        }
    }

    /**
     * 根据ID获取任务实例
     */
    public SiteJobInstance getInstanceById(Integer instanceId) {
        return siteJobInstanceRepository.findById(instanceId);
    }

    /**
     * 根据ID获取任务实例（包含计划详情）
     */
    public SiteJobInstance getInstanceByIdWithPlan(Integer instanceId) {
        return siteJobInstanceRepository.findByIdWithPlan(instanceId);
    }

    /**
     * 根据任务计划ID获取所有任务实例
     */
    public List<SiteJobInstance> getInstancesByPlanId(Integer planId) {
        return siteJobInstanceRepository.findBySiteJobPlanId(planId);
    }

    /**
     * 根据状态获取任务实例
     */
    public List<SiteJobInstance> getInstancesByStatus(JobInstanceStatus status) {
        return siteJobInstanceRepository.findByStatus(status);
    }

    /**
     * 根据处理人获取任务实例
     */
    public List<SiteJobInstance> getInstancesByOperator(String operator) {
        return siteJobInstanceRepository.findByOperator(operator);
    }

    /**
     * 获取待处理的任务实例
     */
    public List<SiteJobInstance> getPendingInstances() {
        return siteJobInstanceRepository.findPendingInstances();
    }

    /**
     * 获取进行中的任务实例
     */
    public List<SiteJobInstance> getInProgressInstances() {
        return siteJobInstanceRepository.findInProgressInstances();
    }

    /**
     * 根据站点ID获取任务实例
     */
    public List<SiteJobInstance> getInstancesBySiteId(Integer siteId) {
        return siteJobInstanceRepository.findBySiteId(siteId);
    }

    /**
     * 根据时间范围获取任务实例
     */
    public List<SiteJobInstance> getInstancesByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return siteJobInstanceRepository.findByTriggerTimeRange(startTime, endTime);
    }

    /**
     * 删除任务实例
     */
    public void deleteInstance(Integer instanceId) {
        SiteJobInstance instance = siteJobInstanceRepository.findById(instanceId);
        if (instance == null) {
            throw new IllegalArgumentException("任务实例不存在");
        }
        siteJobInstanceRepository.deleteById(instanceId);
    }

    /**
     * 批量删除任务实例
     */
    public void deleteInstances(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        siteJobInstanceRepository.deleteByIds(ids);
    }

    /**
     * 根据任务计划生成下一周期的任务实例
     * 用于定时任务周期性调用
     */
    public SiteJobInstance generateNextInstanceForPlan(SiteJobPlan siteJobPlan, String creator) {
        if (siteJobPlan == null) {
            throw new IllegalArgumentException("任务计划不能为空");
        }

        // 查询该计划的最后一个任务实例
        List<SiteJobInstance> instances = siteJobInstanceRepository.findBySiteJobPlanId(siteJobPlan.getId());

        LocalDateTime triggerTime;
        if (instances.isEmpty()) {
            // 如果没有任务实例，使用当前时间作为第一次派发时间
            triggerTime = LocalDateTime.now();
        } else {
            // 找到最后一个任务实例的派发时间
            LocalDateTime lastTriggerTime = instances.stream()
                    .map(SiteJobInstance::getTriggerTime)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.now());

            // 根据周期配置计算下一次派发时间
            triggerTime = siteJobPlan.calculateNextMaintenanceTime(lastTriggerTime);

            if (triggerTime == null) {
                throw new IllegalStateException("无法计算下一次维护时间，请检查周期配置");
            }
        }

        // 生成任务实例
        return generateInstance(siteJobPlan, triggerTime, creator);
    }

    /**
     * 根据任务计划和时间范围补齐缺失的任务实例
     *
     * @param siteJobPlan 任务计划
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param creator 创建人
     * @return 补齐的任务实例列表
     */
    public List<SiteJobInstance> backfillInstancesForPlan(SiteJobPlan siteJobPlan,
                                                           LocalDateTime startTime,
                                                           LocalDateTime endTime,
                                                           String creator) {
        if (siteJobPlan == null) {
            throw new IllegalArgumentException("任务计划不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("开始时间不能晚于结束时间");
        }
        if (siteJobPlan.getPeriodConfig() == null) {
            throw new IllegalArgumentException("任务计划的周期配置不能为空");
        }

        List<SiteJobInstance> backfilledInstances = new ArrayList<>();

        // 计算该时间范围内应该存在的所有派发时间
        List<LocalDateTime> expectedTriggerTimes = calculateTriggerTimesInRange(
                siteJobPlan, startTime, endTime);

        // 查询该计划已存在的任务实例
        List<SiteJobInstance> existingInstances =
                siteJobInstanceRepository.findBySiteJobPlanId(siteJobPlan.getId());

        // 提取已存在实例的派发时间
        java.util.Set<LocalDateTime> existingTriggerTimes = existingInstances.stream()
                .map(SiteJobInstance::getTriggerTime)
                .collect(java.util.stream.Collectors.toSet());

        // 补齐缺失的任务实例
        for (LocalDateTime triggerTime : expectedTriggerTimes) {
            // 检查该派发时间的实例是否已存在
            if (!existingTriggerTimes.contains(triggerTime)) {
                try {
                    SiteJobInstance instance = generateInstance(siteJobPlan, triggerTime, creator);
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
     * @param siteJobPlan 任务计划
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 派发时间列表
     */
    private List<LocalDateTime> calculateTriggerTimesInRange(SiteJobPlan siteJobPlan,
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
            LocalDateTime nextTriggerTime = siteJobPlan.calculateNextMaintenanceTime(currentTriggerTime);

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
     * 根据方案中所有作业类别的最大逾期天数计算
     */
    private LocalDateTime calculateExpiredTime(SiteJobPlan siteJobPlan, LocalDateTime triggerTime) {
        if (siteJobPlan.getScheme() == null ||
            siteJobPlan.getScheme().getItems() == null ||
            siteJobPlan.getScheme().getItems().isEmpty()) {
            // 默认7天过期
            return triggerTime.plusDays(7);
        }

        // 获取所有方案项目中的最大逾期天数
        int maxOverdueDays = siteJobPlan.getScheme().getItems().stream()
                .filter(item -> item.getJobCategory() != null)
                .mapToInt(item -> item.getJobCategory().getOverdueDays() != null
                        ? item.getJobCategory().getOverdueDays()
                        : 0)
                .max()
                .orElse(7); // 默认7天

        return triggerTime.plusDays(maxOverdueDays);
    }

    /**
     * 分页查询任务实例
     */
    public com.baomidou.mybatisplus.core.metadata.IPage<SiteJobInstance> getInstancePage(
            Integer pageNum, Integer pageSize,
            String siteName, String status, LocalDateTime startTime, LocalDateTime endTime,
            String creator, Integer departmentId) {
        return siteJobInstanceRepository.findPageWithDetails(
                pageNum, pageSize, siteName, status, startTime, endTime, creator, departmentId);
    }
}
