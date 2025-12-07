package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SiteJobInstancePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;

/**
 * 站点任务实例DAO
 */
@Mapper
public interface SiteJobInstanceDao extends BaseMapper<SiteJobInstancePO> {

    /**
     * 分页查询站点任务实例（包含关联信息）
     */
    @SelectProvider(type = SiteJobInstanceSqlProvider.class, method = "selectPageWithDetails")
    @Results({
            @Result(column = "id", property = "id"),
            @Result(column = "site_id", property = "siteId"),
            @Result(column = "scheme_id", property = "schemeId"),
            @Result(column = "department_id", property = "departmentId"),
            @Result(column = "site_job_plan_id", property = "siteJobPlanId"),
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
            @Result(column = "scheme_id", property = "scheme",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SchemeDao.selectByIdWithItems")),
            @Result(column = "department_id", property = "department",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DepartmentDao.selectById")),
            @Result(column = "site_job_plan_id", property = "siteJobPlan",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteJobPlanDao.selectByIdWithDetails"))
    })
    IPage<SiteJobInstancePO> selectPageWithDetails(Page<SiteJobInstancePO> page,
                                                    @Param("siteName") String siteName,
                                                    @Param("status") String status,
                                                    @Param("startTime") LocalDateTime startTime,
                                                    @Param("endTime") LocalDateTime endTime,
                                                    @Param("creator") String creator,
                                                    @Param("departmentId") Integer departmentId);

    /**
     * SQL Provider for dynamic queries
     */
    class SiteJobInstanceSqlProvider {
        public String selectPageWithDetails(@Param("siteName") String siteName,
                                            @Param("status") String status,
                                            @Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime,
                                            @Param("creator") String creator,
                                            @Param("departmentId") Integer departmentId) {
            StringBuilder sql = new StringBuilder("SELECT sji.* FROM site_job_instance sji");

            // 如果需要按站点名称过滤，需要JOIN站点表
            if (siteName != null && !siteName.trim().isEmpty()) {
                sql.append(" LEFT JOIN site s ON sji.site_id = s.id");
            }

            sql.append(" WHERE sji.deleted = 0");

            if (siteName != null && !siteName.trim().isEmpty()) {
                sql.append(" AND s.site_name LIKE CONCAT('%', #{siteName}, '%')");
            }

            if (status != null && !status.trim().isEmpty()) {
                sql.append(" AND sji.status = #{status}");
            }

            if (startTime != null) {
                sql.append(" AND sji.trigger_time >= #{startTime}");
            }

            if (endTime != null) {
                sql.append(" AND sji.trigger_time <= #{endTime}");
            }

            if (creator != null && !creator.trim().isEmpty()) {
                sql.append(" AND sji.creator LIKE CONCAT('%', #{creator}, '%')");
            }

            if (departmentId != null) {
                sql.append(" AND sji.department_id = #{departmentId}");
            }

            sql.append(" ORDER BY sji.trigger_time DESC");

            return sql.toString();
        }
    }
}
