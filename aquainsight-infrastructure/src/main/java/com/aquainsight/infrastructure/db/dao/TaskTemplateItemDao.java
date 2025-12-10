package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.TaskTemplateItemPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 任务模版项目DAO
 */
@Mapper
public interface TaskTemplateItemDao extends BaseMapper<TaskTemplateItemPO> {

    /**
     * 根据任务模版ID查询任务模版项目（带步骤模版）
     */
    @Select("SELECT * FROM task_template_item WHERE task_template_id = #{taskTemplateId} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "name", property = "name"),
            @Result(column = "step_template_id", property = "stepTemplateId"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "step_template_id", property = "stepTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.StepTemplateDao.selectById"))
    })
    List<TaskTemplateItemPO> selectByTaskTemplateIdWithStepTemplate(@Param("taskTemplateId") Integer taskTemplateId);
}
