package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.Scheme;

import java.util.List;

/**
 * 方案仓储接口
 */
public interface SchemeRepository {

    /**
     * 保存方案
     */
    Scheme save(Scheme scheme);

    /**
     * 根据ID查询方案
     */
    Scheme findById(Integer id);

    /**
     * 根据编码查询方案
     */
    Scheme findByCode(String code);

    /**
     * 查询所有方案
     */
    List<Scheme> findAll();

    /**
     * 根据名称模糊查询
     */
    List<Scheme> findByNameLike(String name);

    /**
     * 删除方案
     */
    void deleteById(Integer id);

    /**
     * 批量删除方案
     */
    void deleteByIds(List<Integer> ids);

    /**
     * 根据ID查询方案（包含方案项目）
     */
    Scheme findByIdWithItems(Integer id);
}
