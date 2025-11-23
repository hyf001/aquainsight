package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.UserDepartmentPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户-部门关系DAO
 *
 * @author aquainsight
 */
@Mapper
public interface UserDepartmentDao extends BaseMapper<UserDepartmentPO> {
}
