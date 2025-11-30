package com.aquainsight.domain.monitoring.repository;

import com.aquainsight.domain.monitoring.entity.Factor;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Optional;

/**
 * 监测因子仓储接口
 */
public interface FactorRepository {

    /**
     * 保存监测因子
     */
    Factor save(Factor factor);

    /**
     * 根据ID查找监测因子
     */
    Optional<Factor> findById(Integer id);

    /**
     * 根据类别查找监测因子
     */
    List<Factor> findByCategory(String category);

    /**
     * 更新监测因子
     */
    Factor update(Factor factor);

    /**
     * 根据ID删除监测因子
     */
    boolean deleteById(Integer id);

    /**
     * 检查因子代码是否存在
     */
    boolean existsByFactorCode(String factorCode);

    /**
     * 分页查询监测因子
     */
    IPage<Factor> findPage(Integer pageNum, Integer pageSize, String category);

    /**
     * 查询所有监测因子
     */
    List<Factor> findAll();
}
