package com.aquainsight.domain.monitoring.repository;

import com.aquainsight.domain.monitoring.entity.Site;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Optional;

/**
 * 站点仓储接口
 */
public interface SiteRepository {

    /**
     * 保存站点
     */
    Site save(Site site);

    /**
     * 根据ID查找站点
     */
    Optional<Site> findById(Integer id);

    /**
     * 根据站点编码查找站点
     */
    Optional<Site> findBySiteCode(String siteCode);

    /**
     * 查找所有站点
     */
    List<Site> findAll();

    /**
     * 根据站点类型查找站点
     */
    List<Site> findBySiteType(String siteType);

    /**
     * 根据企业ID查找站点
     */
    List<Site> findByEnterpriseId(Integer enterpriseId);

    /**
     * 更新站点
     */
    Site update(Site site);

    /**
     * 根据ID删除站点
     */
    boolean deleteById(Integer id);

    /**
     * 检查站点编码是否存在
     */
    boolean existsBySiteCode(String siteCode);

    /**
     * 分页查询站点
     */
    IPage<Site> findPage(Integer pageNum, Integer pageSize, String siteType, Integer enterpriseId);

    /**
     * 根据企业ID和站点名称查询站点（支持模糊查询）
     */
    List<Site> findByEnterpriseIdAndSiteName(Integer enterpriseId, String siteName);
}
