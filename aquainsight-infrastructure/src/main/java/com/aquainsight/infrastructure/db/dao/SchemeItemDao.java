package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SchemeItemPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 方案项目DAO
 */
@Mapper
public interface SchemeItemDao extends BaseMapper<SchemeItemPO> {

    /**
     * 根据方案ID查询方案项目（带作业类别）
     */
    @Select("SELECT * FROM scheme_item WHERE scheme_id = #{schemeId} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "scheme_id", property = "schemeId"),
            @Result(column = "name", property = "name"),
            @Result(column = "job_category_id", property = "jobCategoryId"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "job_category_id", property = "jobCategory",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.JobCategoryDao.selectById"))
    })
    List<SchemeItemPO> selectBySchemeIdWithJobCategory(@Param("schemeId") Integer schemeId);
}
