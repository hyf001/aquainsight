package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.TaskTemplate;

import java.util.List;

/**
 * 任务模版仓储接口
 */
public interface TaskTemplateRepository {

    /**
     * 保存任务模版
     */
    TaskTemplate save(TaskTemplate taskTemplate);

    /**
     * 根据ID查询任务模版
     */
    TaskTemplate findById(Integer id);

    /**
     * 根据编码查询任务模版
     */
    TaskTemplate findByCode(String code);

    /**
     * 查询所有任务模版
     */
    List<TaskTemplate> findAll();

    /**
     * 根据名称模糊查询
     */
    List<TaskTemplate> findByNameLike(String name);

    /**
     * 删除任务模版
     */
    void deleteById(Integer id);

    /**
     * 批量删除任务模版
     */
    void deleteByIds(List<Integer> ids);

    /**
     * 根据ID查询任务模版（包含任务模版项目）
     */
    TaskTemplate findByIdWithItems(Integer id);
}
