package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SiteJobInstancePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 站点任务实例DAO
 */
@Mapper
public interface SiteJobInstanceDao extends BaseMapper<SiteJobInstancePO> {
}
