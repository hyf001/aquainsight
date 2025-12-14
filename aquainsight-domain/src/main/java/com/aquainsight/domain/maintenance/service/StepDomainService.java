package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.Step;
import com.aquainsight.domain.maintenance.repository.StepRepository;
import com.aquainsight.domain.maintenance.types.ParameterValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 步骤执行领域服务
 */
@Service
@RequiredArgsConstructor
public class StepDomainService {

    private final StepRepository stepRepository;

    /**
     * 保存步骤
     */
    public Step save(Step step) {
        if (step == null) {
            throw new IllegalArgumentException("步骤不能为空");
        }
        if (step.getTaskId() == null) {
            throw new IllegalArgumentException("任务ID不能为空");
        }
        if (step.getStepTemplateId() == null) {
            throw new IllegalArgumentException("步骤模板ID不能为空");
        }
        return stepRepository.save(step);
    }

    /**
     * 批量保存步骤
     */
    public void saveBatch(List<Step> steps) {
        if (steps == null || steps.isEmpty()) {
            return;
        }
        stepRepository.saveBatch(steps);
    }

    /**
     * 根据ID查询步骤
     */
    public Step findById(Integer id) {
        return stepRepository.findById(id);
    }

    /**
     * 根据任务ID查询所有步骤
     */
    public List<Step> findByTaskId(Integer taskId) {
        return stepRepository.findByTaskId(taskId);
    }

    /**
     * 根据任务ID和步骤模板ID查询步骤
     */
    public Step findByTaskIdAndStepTemplateId(Integer taskId, Integer stepTemplateId) {
        return stepRepository.findByTaskIdAndStepTemplateId(taskId, stepTemplateId);
    }

    /**
     * 填写步骤参数
     * @param taskId 任务ID
     * @param stepTemplateId 步骤模板ID
     * @param stepName 步骤名称
     * @param parameterValues 参数值Map
     * @return 更新后的步骤
     */
    public Step fillStepParameters(Integer taskId,
                                    Integer stepTemplateId,
                                    String stepName,
                                    Map<String, Object> parameterValues) {
        // 查询是否已存在该步骤
        Step step = stepRepository.findByTaskIdAndStepTemplateId(taskId, stepTemplateId);

        if (step == null) {
            // 创建新步骤
            step = Step.builder()
                    .taskId(taskId)
                    .stepTemplateId(stepTemplateId)
                    .stepName(stepName)
                    .createTime(LocalDateTime.now())
                    .updateTime(LocalDateTime.now())
                    .build();
        }

        // 更新参数值
        for (Map.Entry<String, Object> entry : parameterValues.entrySet()) {
            ParameterValue paramValue = ParameterValue.builder()
                    .name(entry.getKey())
                    .value(entry.getValue())
                    .fillTime(LocalDateTime.now())
                    .build();
            step.addOrUpdateParameter(paramValue);
        }

        return stepRepository.save(step);
    }

    /**
     * 删除步骤
     */
    public void deleteById(Integer id) {
        stepRepository.deleteById(id);
    }

    /**
     * 根据任务ID删除所有步骤
     */
    public void deleteByTaskId(Integer taskId) {
        stepRepository.deleteByTaskId(taskId);
    }
}
