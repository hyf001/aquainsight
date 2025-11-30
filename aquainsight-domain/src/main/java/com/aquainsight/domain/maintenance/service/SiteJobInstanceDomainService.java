package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        List<SiteJobInstance> overdueInstances = siteJobInstanceRepository.findOverdueInstances(now);

        for (SiteJobInstance instance : overdueInstances) {
            instance.checkAndMarkOverdue();
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
}
