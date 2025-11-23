package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.FactorPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 监测因子DAO
 */
@Mapper
public interface FactorDao extends BaseMapper<FactorPO> {
}
