package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SitePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 站点DAO
 */
@Mapper
public interface SiteDao extends BaseMapper<SitePO> {
}
