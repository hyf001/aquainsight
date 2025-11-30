package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SiteJobPlanPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;

/**
 * 站点任务计划DAO
 */
@Mapper
public interface SiteJobPlanDao extends BaseMapper<SiteJobPlanPO> {

    /**
     * 根据站点ID查询任务计划（包含关联的站点、方案、部门信息）
     */
    @Select("SELECT * FROM site_job_plan WHERE site_id = #{siteId} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "period_config", property = "periodConfig"),
            @Result(column = "scheme_id", property = "schemeId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "updater", property = "updater"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectById")),
            @Result(column = "scheme_id", property = "scheme",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SchemeDao.selectById")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById"))
    })
    SiteJobPlanPO selectBySiteIdWithDetails(@Param("siteId") Integer siteId);

    /**
     * 根据ID查询任务计划（包含关联信息）
     */
    @Select("SELECT * FROM site_job_plan WHERE id = #{id} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "period_config", property = "periodConfig"),
            @Result(column = "scheme_id", property = "schemeId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "updater", property = "updater"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectById")),
            @Result(column = "scheme_id", property = "scheme",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SchemeDao.selectById")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById"))
    })
    SiteJobPlanPO selectByIdWithDetails(@Param("id") Integer id);
}
