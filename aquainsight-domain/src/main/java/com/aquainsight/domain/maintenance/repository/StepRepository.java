package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.Step;

import java.util.List;

/**
 * 步骤执行仓储接口
 */
public interface StepRepository {

    /**
     * 保存步骤
     */
    Step save(Step step);

    /**
     * 批量保存步骤
     */
    void saveBatch(List<Step> steps);

    /**
     * 根据ID查询步骤
     */
    Step findById(Integer id);

    /**
     * 根据任务ID查询所有步骤
     */
    List<Step> findByTaskId(Integer taskId);

    /**
     * 根据任务ID和步骤模板ID查询步骤
     */
    Step findByTaskIdAndStepTemplateId(Integer taskId, Integer stepTemplateId);

    /**
     * 删除步骤
     */
    void deleteById(Integer id);

    /**
     * 根据任务ID删除所有步骤
     */
    void deleteByTaskId(Integer taskId);
}
