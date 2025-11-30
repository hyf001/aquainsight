package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.EnterprisePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 企业Mapper
 */
@Mapper
public interface EnterpriseDao extends BaseMapper<EnterprisePO> {
}
