package com.aquainsight.domain.monitoring.repository;

import com.aquainsight.domain.monitoring.entity.Device;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Optional;

/**
 * 设备实例仓储接口
 */
public interface DeviceRepository {

    /**
     * 保存设备实例
     */
    Device save(Device device);

    /**
     * 根据ID查找设备实例
     */
    Optional<Device> findById(Integer id);

    /**
     * 根据设备编码查找设备实例
     */
    Optional<Device> findByDeviceCode(String deviceCode);

    /**
     * 查找所有设备实例
     */
    List<Device> findAll();

    /**
     * 根据站点ID查找设备实例
     */
    List<Device> findBySiteId(Integer siteId);

    /**
     * 根据设备型号ID查找设备实例
     */
    List<Device> findByDeviceModelId(Integer deviceModelId);

    /**
     * 根据状态查找设备实例
     */
    List<Device> findByStatus(Integer status);

    /**
     * 更新设备实例
     */
    Device update(Device device);

    /**
     * 根据ID删除设备实例
     */
    boolean deleteById(Integer id);

    /**
     * 检查设备编码是否存在
     */
    boolean existsByDeviceCode(String deviceCode);

    /**
     * 分页查询设备实例
     */
    IPage<Device> findPage(Integer pageNum, Integer pageSize, Integer siteId, Integer deviceModelId);
}
