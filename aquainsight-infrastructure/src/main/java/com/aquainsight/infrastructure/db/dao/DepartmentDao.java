package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.DepartmentPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 部门DAO
 *
 * @author aquainsight
 */
@Mapper
public interface DepartmentDao extends BaseMapper<DepartmentPO> {
}
