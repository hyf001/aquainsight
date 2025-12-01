package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.SitePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 站点DAO
 */
@Mapper
public interface SiteDao extends BaseMapper<SitePO> {

    /**
     * 根据ID查询站点（包含企业信息）
     */
    @Select("SELECT * FROM site WHERE id = #{id} AND deleted = 0")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    SitePO selectByIdWithEnterprise(Integer id);

    /**
     * 根据站点编码查询站点（包含企业信息）
     */
    @Select("SELECT * FROM site WHERE site_code = #{siteCode} AND deleted = 0")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    SitePO selectBySiteCodeWithEnterprise(String siteCode);

    /**
     * 查询所有站点（包含企业信息）
     */
    @Select("SELECT * FROM site WHERE deleted = 0")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    List<SitePO> selectAllWithEnterprise();

    /**
     * 根据站点类型查询站点（包含企业信息）
     */
    @Select("SELECT * FROM site WHERE site_type = #{siteType} AND deleted = 0")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    List<SitePO> selectBySiteTypeWithEnterprise(String siteType);

    /**
     * 根据企业ID查询站点（包含企业信息）
     */
    @Select("SELECT * FROM site WHERE enterprise_id = #{enterpriseId} AND deleted = 0")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    List<SitePO> selectByEnterpriseIdWithEnterprise(Integer enterpriseId);

    /**
     * 分页查询站点（包含企业信息）
     */
    @SelectProvider(type = SiteSqlProvider.class, method = "selectPageWithEnterprise")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    IPage<SitePO> selectPageWithEnterprise(Page<SitePO> page, @Param("siteType") String siteType, @Param("enterpriseId") Integer enterpriseId);

    /**
     * 根据企业ID和站点名称查询站点（包含企业信息）
     */
    @SelectProvider(type = SiteSqlProvider.class, method = "selectByEnterpriseIdAndSiteNameWithEnterprise")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "siteCode", column = "site_code"),
            @Result(property = "siteName", column = "site_name"),
            @Result(property = "siteType", column = "site_type"),
            @Result(property = "siteTag", column = "site_tag"),
            @Result(property = "longitude", column = "longitude"),
            @Result(property = "latitude", column = "latitude"),
            @Result(property = "address", column = "address"),
            @Result(property = "enterpriseId", column = "enterprise_id"),
            @Result(property = "isAutoUpload", column = "is_auto_upload"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "enterprise", column = "enterprise_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.EnterpriseDao.selectById"))
    })
    List<SitePO> selectByEnterpriseIdAndSiteNameWithEnterprise(@Param("enterpriseId") Integer enterpriseId, @Param("siteName") String siteName);

    /**
     * SQL Provider for dynamic queries
     */
    class SiteSqlProvider {
        public String selectPageWithEnterprise(@Param("siteType") String siteType, @Param("enterpriseId") Integer enterpriseId) {
            StringBuilder sql = new StringBuilder("SELECT * FROM site WHERE deleted = 0");
            if (siteType != null && !siteType.trim().isEmpty()) {
                sql.append(" AND site_type = #{siteType}");
            }
            if (enterpriseId != null) {
                sql.append(" AND enterprise_id = #{enterpriseId}");
            }
            return sql.toString();
        }

        public String selectByEnterpriseIdAndSiteNameWithEnterprise(@Param("enterpriseId") Integer enterpriseId, @Param("siteName") String siteName) {
            StringBuilder sql = new StringBuilder("SELECT * FROM site WHERE deleted = 0");
            if (enterpriseId != null) {
                sql.append(" AND enterprise_id = #{enterpriseId}");
            }
            if (siteName != null && !siteName.trim().isEmpty()) {
                sql.append(" AND site_name LIKE CONCAT('%', #{siteName}, '%')");
            }
            return sql.toString();
        }
    }
}
