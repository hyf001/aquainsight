package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.FactorPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 监测因子DAO
 * 注意：Factor 不再关联 DeviceModel，而是 DeviceModel 关联 Factor (多对一)
 */
@Mapper
public interface FactorDao extends BaseMapper<FactorPO> {
}
