package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.TaskTemplatePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;

/**
 * 任务模版DAO
 */
@Mapper
public interface TaskTemplateDao extends BaseMapper<TaskTemplatePO> {

    /**
     * 根据ID查询任务模版(包含任务模版项)
     */
    @Select("SELECT * FROM task_template WHERE id = #{id} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "name", property = "name"),
            @Result(column = "code", property = "code"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "id", property = "items",
                    many = @Many(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateItemDao.selectByTaskTemplateIdWithStepTemplate"))
    })
    TaskTemplatePO selectByIdWithItems(@Param("id") Integer id);
}
