package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.SchemeItem;

import java.util.List;

/**
 * 方案项目仓储接口
 */
public interface SchemeItemRepository {

    /**
     * 保存方案项目
     */
    SchemeItem save(SchemeItem schemeItem);

    /**
     * 根据ID查询方案项目
     */
    SchemeItem findById(Integer id);

    /**
     * 根据方案ID查询方案项目列表
     */
    List<SchemeItem> findBySchemeId(Integer schemeId);

    /**
     * 删除方案项目
     */
    void deleteById(Integer id);

    /**
     * 批量删除方案项目
     */
    void deleteByIds(List<Integer> ids);

    /**
     * 根据方案ID删除所有方案项目
     */
    void deleteBySchemeId(Integer schemeId);
}
