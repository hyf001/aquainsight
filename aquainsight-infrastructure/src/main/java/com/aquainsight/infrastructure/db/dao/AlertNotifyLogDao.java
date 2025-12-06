package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.AlertNotifyLogPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 告警通知日志DAO
 */
@Mapper
public interface AlertNotifyLogDao extends BaseMapper<AlertNotifyLogPO> {
}
