package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.DevicePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 设备实例DAO
 */
@Mapper
public interface DeviceDao extends BaseMapper<DevicePO> {
}
