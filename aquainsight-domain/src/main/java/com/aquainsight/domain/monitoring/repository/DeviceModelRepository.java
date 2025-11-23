package com.aquainsight.domain.monitoring.repository;

import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Optional;

/**
 * 设备型号仓储接口
 */
public interface DeviceModelRepository {

    /**
     * 保存设备型号
     */
    DeviceModel save(DeviceModel deviceModel);

    /**
     * 根据ID查找设备型号
     */
    Optional<DeviceModel> findById(Integer id);

    /**
     * 根据型号编码查找设备型号
     */
    Optional<DeviceModel> findByModelCode(String modelCode);

    /**
     * 查找所有设备型号
     */
    List<DeviceModel> findAll();

    /**
     * 根据设备类型查找设备型号
     */
    List<DeviceModel> findByDeviceType(String deviceType);

    /**
     * 根据制造商查找设备型号
     */
    List<DeviceModel> findByManufacturer(String manufacturer);

    /**
     * 更新设备型号
     */
    DeviceModel update(DeviceModel deviceModel);

    /**
     * 根据ID删除设备型号
     */
    boolean deleteById(Integer id);

    /**
     * 检查型号编码是否存在
     */
    boolean existsByModelCode(String modelCode);

    /**
     * 分页查询设备型号
     */
    IPage<DeviceModel> findPage(Integer pageNum, Integer pageSize, String deviceType);
}
