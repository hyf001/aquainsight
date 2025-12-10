package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;

import java.util.List;

/**
 * 任务模版项目仓储接口
 */
public interface TaskTemplateItemRepository {

    /**
     * 保存任务模版项目
     */
    TaskTemplateItem save(TaskTemplateItem taskTemplateItem);

    /**
     * 根据ID查询任务模版项目
     */
    TaskTemplateItem findById(Integer id);

    /**
     * 根据任务模版ID查询任务模版项目列表
     */
    List<TaskTemplateItem> findByTaskTemplateId(Integer taskTemplateId);

    /**
     * 删除任务模版项目
     */
    void deleteById(Integer id);

    /**
     * 批量删除任务模版项目
     */
    void deleteByIds(List<Integer> ids);

    /**
     * 根据任务模版ID删除所有任务模版项目
     */
    void deleteByTaskTemplateId(Integer taskTemplateId);
}
