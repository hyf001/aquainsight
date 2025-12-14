package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.StepPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 步骤执行DAO
 */
@Mapper
public interface StepDao extends BaseMapper<StepPO> {

    /**
     * 根据任务ID查询所有步骤
     */
    @Select("SELECT * FROM step WHERE task_id = #{taskId} ORDER BY create_time ASC")
    List<StepPO> selectByTaskId(@Param("taskId") Integer taskId);

    /**
     * 根据任务ID和步骤模板ID查询步骤
     */
    @Select("SELECT * FROM step WHERE task_id = #{taskId} AND step_template_id = #{stepTemplateId} LIMIT 1")
    StepPO selectByTaskIdAndStepTemplateId(@Param("taskId") Integer taskId,
                                           @Param("stepTemplateId") Integer stepTemplateId);
}
