package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.UserPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户DAO
 *
 * @author aquainsight
 */
@Mapper
public interface UserDao extends BaseMapper<UserPO> {
}
