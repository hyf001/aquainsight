package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.DeviceModelPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 设备型号DAO
 */
@Mapper
public interface DeviceModelDao extends BaseMapper<DeviceModelPO> {

    /**
     * 根据ID查询设备型号（包含因子信息）
     */
    @Select("SELECT * FROM device_model WHERE id = #{id} AND deleted = 0")
    @Results(id = "deviceModelWithFactor", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "modelCode", column = "model_code"),
            @Result(property = "modelName", column = "model_name"),
            @Result(property = "deviceType", column = "device_type"),
            @Result(property = "manufacturer", column = "manufacturer"),
            @Result(property = "description", column = "description"),
            @Result(property = "specifications", column = "specifications"),
            @Result(property = "factorId", column = "factor_id"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "updateTime", column = "update_time"),
            @Result(property = "deleted", column = "deleted"),
            @Result(property = "factor", column = "factor_id",
                    one = @One(select = "com.aquainsight.infrastructure.db.dao.FactorDao.selectById"))
    })
    DeviceModelPO selectByIdWithFactor(Integer id);

    /**
     * 根据型号编码查询设备型号（包含因子信息）
     */
    @Select("SELECT * FROM device_model WHERE model_code = #{modelCode} AND deleted = 0")
    @ResultMap("deviceModelWithFactor")
    DeviceModelPO selectByModelCodeWithFactor(String modelCode);

    /**
     * 查询所有设备型号（包含因子信息）
     */
    @Select("SELECT * FROM device_model WHERE deleted = 0")
    @ResultMap("deviceModelWithFactor")
    List<DeviceModelPO> selectAllWithFactor();

    /**
     * 分页查询设备型号（包含因子信息）
     */
    @SelectProvider(type = DeviceModelSqlProvider.class, method = "selectPageWithFactor")
    @ResultMap("deviceModelWithFactor")
    IPage<DeviceModelPO> selectPageWithFactor(Page<DeviceModelPO> page, @Param("deviceType") String deviceType);

    /**
     * SQL Provider for dynamic queries
     */
    class DeviceModelSqlProvider {
        public String selectPageWithFactor(@Param("deviceType") String deviceType) {
            StringBuilder sql = new StringBuilder("SELECT * FROM device_model WHERE deleted = 0");
            if (deviceType != null && !deviceType.trim().isEmpty()) {
                sql.append(" AND device_type = #{deviceType}");
            }
            return sql.toString();
        }
    }
}
