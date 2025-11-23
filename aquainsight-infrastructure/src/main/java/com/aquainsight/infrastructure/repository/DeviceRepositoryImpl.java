package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.monitoring.entity.Device;
import com.aquainsight.domain.monitoring.repository.DeviceRepository;
import com.aquainsight.infrastructure.converter.DeviceConverter;
import com.aquainsight.infrastructure.db.dao.DeviceDao;
import com.aquainsight.infrastructure.db.model.DevicePO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 设备实例仓储实现
 */
@Repository
@RequiredArgsConstructor
public class DeviceRepositoryImpl implements DeviceRepository {

    private final DeviceDao deviceDao;

    @Override
    public Device save(Device device) {
        DevicePO devicePO = DeviceConverter.INSTANCE.toPO(device);
        deviceDao.insert(devicePO);
        return DeviceConverter.INSTANCE.toEntity(devicePO);
    }

    @Override
    public Optional<Device> findById(Integer id) {
        DevicePO devicePO = deviceDao.selectById(id);
        return Optional.ofNullable(devicePO).map(DeviceConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<Device> findByDeviceCode(String deviceCode) {
        LambdaQueryWrapper<DevicePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DevicePO::getDeviceCode, deviceCode);
        DevicePO devicePO = deviceDao.selectOne(wrapper);
        return Optional.ofNullable(devicePO).map(DeviceConverter.INSTANCE::toEntity);
    }

    @Override
    public List<Device> findAll() {
        List<DevicePO> devicePOList = deviceDao.selectList(null);
        return DeviceConverter.INSTANCE.toEntityList(devicePOList);
    }

    @Override
    public List<Device> findBySiteId(Integer siteId) {
        LambdaQueryWrapper<DevicePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DevicePO::getSiteId, siteId);
        List<DevicePO> devicePOList = deviceDao.selectList(wrapper);
        return DeviceConverter.INSTANCE.toEntityList(devicePOList);
    }

    @Override
    public List<Device> findByDeviceModelId(Integer deviceModelId) {
        LambdaQueryWrapper<DevicePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DevicePO::getDeviceModelId, deviceModelId);
        List<DevicePO> devicePOList = deviceDao.selectList(wrapper);
        return DeviceConverter.INSTANCE.toEntityList(devicePOList);
    }

    @Override
    public List<Device> findByStatus(Integer status) {
        LambdaQueryWrapper<DevicePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DevicePO::getStatus, status);
        List<DevicePO> devicePOList = deviceDao.selectList(wrapper);
        return DeviceConverter.INSTANCE.toEntityList(devicePOList);
    }

    @Override
    public Device update(Device device) {
        DevicePO devicePO = DeviceConverter.INSTANCE.toPO(device);
        deviceDao.updateById(devicePO);
        return DeviceConverter.INSTANCE.toEntity(devicePO);
    }

    @Override
    public boolean deleteById(Integer id) {
        return deviceDao.deleteById(id) > 0;
    }

    @Override
    public boolean existsByDeviceCode(String deviceCode) {
        LambdaQueryWrapper<DevicePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DevicePO::getDeviceCode, deviceCode);
        return deviceDao.selectCount(wrapper) > 0;
    }

    @Override
    public IPage<Device> findPage(Integer pageNum, Integer pageSize, Integer siteId, Integer deviceModelId) {
        Page<DevicePO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<DevicePO> wrapper = new LambdaQueryWrapper<>();

        if (siteId != null) {
            wrapper.eq(DevicePO::getSiteId, siteId);
        }
        if (deviceModelId != null) {
            wrapper.eq(DevicePO::getDeviceModelId, deviceModelId);
        }

        IPage<DevicePO> poPage = deviceDao.selectPage(page, wrapper);
        Page<Device> devicePage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        devicePage.setRecords(DeviceConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return devicePage;
    }
}
