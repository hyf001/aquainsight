package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.DeviceModelPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 设备型号DAO
 */
@Mapper
public interface DeviceModelDao extends BaseMapper<DeviceModelPO> {
}
