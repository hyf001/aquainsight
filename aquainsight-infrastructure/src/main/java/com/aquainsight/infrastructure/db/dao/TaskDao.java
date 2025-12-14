package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.TaskPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;

/**
 * 站点任务DAO
 */
@Mapper
public interface TaskDao extends BaseMapper<TaskPO> {

    /**
     * 查询任务详情（包含步骤、站点、任务模版等关联信息）
     */
    @Select("SELECT * FROM task WHERE id = #{id} AND deleted = 0")
    @Results(id = "taskDetailResult", value = {
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "task_scheduler_id", property = "taskSchedulerId"),
            @Result(column = "trigger_time", property = "triggerTime"),
            @Result(column = "start_time", property = "startTime"),
            @Result(column = "end_time", property = "endTime"),
            @Result(column = "status", property = "status"),
            @Result(column = "expired_time", property = "expiredTime"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "operator", property = "operator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectById")),
            @Result(column = "task_template_id", property = "taskTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateDao.selectByIdWithItems")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById")),
            @Result(column = "id", property = "steps",
                    many = @Many(select = "com.aquainsight.infrastructure.db.dao.StepDao.selectByTaskId"))
    })
    TaskPO selectByIdWithDetails(@Param("id") Integer id);

    /**
     * 分页查询站点任务（包含关联信息）
     */
    @SelectProvider(type = TaskSqlProvider.class, method = "selectPageWithDetails")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "task_template_id", property = "taskTemplateId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "task_scheduler_id", property = "taskSchedulerId"),
            @Result(column = "trigger_time", property = "triggerTime"),
            @Result(column = "start_time", property = "startTime"),
            @Result(column = "end_time", property = "endTime"),
            @Result(column = "status", property = "status"),
            @Result(column = "expired_time", property = "expiredTime"),
            @Result(column = "creator", property = "creator"),
            @Result(column = "operator", property = "operator"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "deleted", property = "deleted"),
            @Result(column = "site_id", property = "site",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectById")),
            @Result(column = "task_template_id", property = "taskTemplate",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskTemplateDao.selectByIdWithItems")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById")),
            @Result(column = "task_scheduler_id", property = "taskScheduler",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.TaskSchedulerDao.selectByIdWithDetails"))
    })
    IPage<TaskPO> selectPageWithDetails(Page<TaskPO> page,
                                                    @Param("siteName") String siteName,
                                                    @Param("status") String status,
                                                    @Param("startTime") LocalDateTime startTime,
                                                    @Param("endTime") LocalDateTime endTime,
                                                    @Param("creator") String creator,
                                                    @Param("departmentId") Integer departmentId);

    /**
     * SQL Provider for dynamic queries
     */
    class TaskSqlProvider {
        public String selectPageWithDetails(@Param("siteName") String siteName,
                                            @Param("status") String status,
                                            @Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime,
                                            @Param("creator") String creator,
                                            @Param("departmentId") Integer departmentId) {
            StringBuilder sql = new StringBuilder("SELECT t.* FROM task t");

            // 如果需要按站点名称过滤，需要JOIN站点表
            if (siteName != null && !siteName.trim().isEmpty()) {
                sql.append(" LEFT JOIN site s ON t.site_id = s.id");
            }

            sql.append(" WHERE t.deleted = 0");

            if (siteName != null && !siteName.trim().isEmpty()) {
                sql.append(" AND s.site_name LIKE CONCAT('%', #{siteName}, '%')");
            }

            if (status != null && !status.trim().isEmpty()) {
                sql.append(" AND t.status = #{status}");
            }

            if (startTime != null) {
                sql.append(" AND t.trigger_time >= #{startTime}");
            }

            if (endTime != null) {
                sql.append(" AND t.trigger_time <= #{endTime}");
            }

            if (creator != null && !creator.trim().isEmpty()) {
                sql.append(" AND t.creator LIKE CONCAT('%', #{creator}, '%')");
            }

            if (departmentId != null) {
                sql.append(" AND t.department_id = #{departmentId}");
            }

            sql.append(" ORDER BY t.trigger_time DESC");

            return sql.toString();
        }
    }
}
