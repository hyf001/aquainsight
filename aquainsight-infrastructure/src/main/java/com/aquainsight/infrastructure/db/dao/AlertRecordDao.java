package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.AlertRecordPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 告警记录DAO
 */
@Mapper
public interface AlertRecordDao extends BaseMapper<AlertRecordPO> {
}
