package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.StepTemplate;

import java.util.List;

/**
 * 步骤模版仓储接口
 */
public interface StepTemplateRepository {

    /**
     * 保存步骤模版
     */
    StepTemplate save(StepTemplate stepTemplate);

    /**
     * 根据ID查询步骤模版
     */
    StepTemplate findById(Integer id);

    /**
     * 根据编码查询步骤模版
     */
    StepTemplate findByCode(String code);

    /**
     * 查询所有步骤模版
     */
    List<StepTemplate> findAll();

    /**
     * 根据名称模糊查询
     */
    List<StepTemplate> findByNameLike(String name);

    /**
     * 删除步骤模版
     */
    void deleteById(Integer id);

    /**
     * 批量删除步骤模版
     */
    void deleteByIds(List<Integer> ids);
}
