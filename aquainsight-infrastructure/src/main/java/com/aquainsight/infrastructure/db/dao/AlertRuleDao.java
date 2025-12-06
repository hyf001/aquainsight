package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.AlertRulePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 告警规则DAO
 */
@Mapper
public interface AlertRuleDao extends BaseMapper<AlertRulePO> {
}
