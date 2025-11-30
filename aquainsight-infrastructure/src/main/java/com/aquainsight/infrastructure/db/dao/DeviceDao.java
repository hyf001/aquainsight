package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.DevicePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 设备实例DAO
 */
@Mapper
public interface DeviceDao extends BaseMapper<DevicePO> {

    /**
     * 根据ID查询设备（包含站点和设备型号信息）
     */
    @Select("SELECT * FROM device WHERE id = #{id} AND deleted = 0")
    @Results(id = "deviceWithAssociations", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "deviceCode", column = "device_code"),
            @Result(property = "deviceName", column = "device_name"),
            @Result(property = "siteId", column = "site_id"),
            @Result(property = "deviceModelId", column = "device_model_id"),
            @Result(property = "serialNumber", column = "serial_number"),
            @Result(property = "installLocation", column = "install_location"),
            @Result(property = "status", column = "status"),
            @Result(property = "installDate", column = "install_date"),
            @Result(property = "maintenanceDate", column = "maintenance_date"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "site", column = "site_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.SiteDao.selectByIdWithEnterprise")),
            @Result(property = "deviceModel", column = "device_model_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.DeviceModelDao.selectByIdWithFactor"))
    })
    DevicePO selectByIdWithAssociations(Integer id);

    /**
     * 根据设备编码查询设备（包含站点和设备型号信息）
     */
    @Select("SELECT * FROM device WHERE device_code = #{deviceCode} AND deleted = 0")
    @ResultMap("deviceWithAssociations")
    DevicePO selectByDeviceCodeWithAssociations(String deviceCode);

    /**
     * 查询所有设备（包含站点和设备型号信息）
     */
    @Select("SELECT * FROM device WHERE deleted = 0")
    @ResultMap("deviceWithAssociations")
    List<DevicePO> selectAllWithAssociations();

    /**
     * 根据站点ID查询设备（包含站点和设备型号信息）
     */
    @Select("SELECT * FROM device WHERE site_id = #{siteId} AND deleted = 0")
    @ResultMap("deviceWithAssociations")
    List<DevicePO> selectBySiteIdWithAssociations(Integer siteId);

    /**
     * 根据设备型号ID查询设备（包含站点和设备型号信息）
     */
    @Select("SELECT * FROM device WHERE device_model_id = #{deviceModelId} AND deleted = 0")
    @ResultMap("deviceWithAssociations")
    List<DevicePO> selectByDeviceModelIdWithAssociations(Integer deviceModelId);

    /**
     * 分页查询设备（包含站点和设备型号信息）
     */
    @SelectProvider(type = DeviceSqlProvider.class, method = "selectPageWithAssociations")
    @ResultMap("deviceWithAssociations")
    IPage<DevicePO> selectPageWithAssociations(Page<DevicePO> page, @Param("siteId") Integer siteId, @Param("deviceModelId") Integer deviceModelId);

    /**
     * SQL Provider for dynamic queries
     */
    class DeviceSqlProvider {
        public String selectPageWithAssociations(@Param("siteId") Integer siteId, @Param("deviceModelId") Integer deviceModelId) {
            StringBuilder sql = new StringBuilder("SELECT * FROM device WHERE deleted = 0");
            if (siteId != null) {
                sql.append(" AND site_id = #{siteId}");
            }
            if (deviceModelId != null) {
                sql.append(" AND device_model_id = #{deviceModelId}");
            }
            return sql.toString();
        }
    }
}
