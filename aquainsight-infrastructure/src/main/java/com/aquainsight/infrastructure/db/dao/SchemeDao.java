package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SchemePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 方案DAO
 */
@Mapper
public interface SchemeDao extends BaseMapper<SchemePO> {
}
