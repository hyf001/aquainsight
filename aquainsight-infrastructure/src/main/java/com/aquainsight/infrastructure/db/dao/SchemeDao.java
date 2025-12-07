package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SchemePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;

/**
 * 方案DAO
 */
@Mapper
public interface SchemeDao extends BaseMapper<SchemePO> {

    /**
     * 根据ID查询方案(包含方案项)
     */
    @Select("SELECT * FROM scheme WHERE id = #{id} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "name", property = "name"),
            @Result(column = "code", property = "code"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "id", property = "items",
                    many = @Many(select = "com.aquainsight.infrastructure.db.dao.SchemeItemDao.selectBySchemeIdWithJobCategory"))
    })
    SchemePO selectByIdWithItems(@Param("id") Integer id);
}
