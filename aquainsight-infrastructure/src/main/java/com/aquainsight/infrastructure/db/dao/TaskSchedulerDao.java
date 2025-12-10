package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.TaskSchedulerPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 站点任务调度DAO
 */
@Mapper
public interface TaskSchedulerDao extends BaseMapper<TaskSchedulerPO> {

    /**
     * 根据站点ID查询任务调度（包含关联的站点、任务模版、部门信息）
     */
    @Select("SELECT * FROM task_scheduler WHERE site_id = #{siteId} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "period_config", property = "periodConfig"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "updater", property = "updater"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectById")),
            @Result(column = "task_template_id", property = "taskTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateDao.selectById")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById"))
    })
    TaskSchedulerPO selectBySiteIdWithDetails(@Param("siteId") Integer siteId);

    /**
     * 根据ID查询任务调度（包含关联信息）
     */
    @Select("SELECT * FROM task_scheduler WHERE id = #{id} AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "period_config", property = "periodConfig"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "updater", property = "updater"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectByIdWithEnterprise")),
            @Result(column = "task_template_id", property = "taskTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateDao.selectById")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById"))
    })
    TaskSchedulerPO selectByIdWithDetails(@Param("id") Integer id);

    /**
     * 分页查询站点任务调度（包含关联信息）
     */
    @SelectProvider(type = TaskSchedulerSqlProvider.class, method = "selectPageWithDetails")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "period_config", property = "periodConfig"),
            @Result(column = "task_scheduler_state", property = "taskSchedulerState"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "updater", property = "updater"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectByIdWithEnterprise")),
            @Result(column = "task_template_id", property = "taskTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateDao.selectById")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById"))
    })
    IPage<TaskSchedulerPO> selectPageWithDetails(Page<TaskSchedulerPO> page,
                                               @Param("siteName") String siteName,
                                               @Param("siteIds") List<Integer> siteIds,
                                               @Param("departmentId") Integer departmentId);

    /**
     * 查询所有启用中的任务调度（包含关联信息）
     */
    @Select("SELECT * FROM task_scheduler WHERE task_scheduler_state = 'IN_PROGRESS' AND deleted = 0")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "period_config", property = "periodConfig"),
            @Result(column = "task_scheduler_state", property = "taskSchedulerState"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "updater", property = "updater"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectById")),
            @Result(column = "task_template_id", property = "taskTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateDao.selectByIdWithItems")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById"))
    })
    List<TaskSchedulerPO> selectActiveTaskSchedulersWithDetails();

    /**
     * SQL Provider for dynamic queries
     */
    class TaskSchedulerSqlProvider {
        public String selectPageWithDetails(@Param("siteName") String siteName,
                                            @Param("siteIds") List<Integer> siteIds,
                                            @Param("departmentId") Integer departmentId) {
            StringBuilder sql = new StringBuilder("SELECT sjp.* FROM task_scheduler sjp");

            // 如果需要按站点名称过滤，需要JOIN site表
            boolean needSiteJoin = (siteName != null && !siteName.trim().isEmpty());
            if (needSiteJoin) {
                sql.append(" LEFT JOIN site s ON sjp.site_id = s.id");
            }

            sql.append(" WHERE sjp.deleted = 0");

            if (siteName != null && !siteName.trim().isEmpty()) {
                sql.append(" AND s.site_name LIKE CONCAT('%', #{siteName}, '%')");
            }

            if (siteIds != null && !siteIds.isEmpty()) {
                sql.append(" AND sjp.site_id IN (");
                for (int i = 0; i < siteIds.size(); i++) {
                    if (i > 0) sql.append(",");
                    sql.append("#{siteIds[").append(i).append("]}");
                }
                sql.append(")");
            }

            if (departmentId != null) {
                sql.append(" AND sjp.department_id = #{departmentId}");
            }

            sql.append(" ORDER BY sjp.create_time DESC");

            return sql.toString();
        }
    }
}
