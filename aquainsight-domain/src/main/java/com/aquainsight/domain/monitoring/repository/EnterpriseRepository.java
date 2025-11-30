package com.aquainsight.domain.monitoring.repository;

import com.aquainsight.domain.monitoring.entity.Enterprise;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Optional;

/**
 * 企业仓储接口
 */
public interface EnterpriseRepository {

    /**
     * 保存企业
     */
    Enterprise save(Enterprise enterprise);

    /**
     * 根据ID查找企业
     */
    Optional<Enterprise> findById(Integer id);

    /**
     * 根据企业编码查找企业
     */
    Optional<Enterprise> findByEnterpriseCode(String enterpriseCode);

    /**
     * 查找所有企业
     */
    List<Enterprise> findAll();

    /**
     * 根据企业标签查找企业
     */
    List<Enterprise> findByEnterpriseTag(String enterpriseTag);

    /**
     * 更新企业
     */
    Enterprise update(Enterprise enterprise);

    /**
     * 根据ID删除企业
     */
    boolean deleteById(Integer id);

    /**
     * 检查企业编码是否存在
     */
    boolean existsByEnterpriseCode(String enterpriseCode);

    /**
     * 分页查询企业
     */
    IPage<Enterprise> findPage(Integer pageNum, Integer pageSize, String enterpriseName, String enterpriseTag);
}
