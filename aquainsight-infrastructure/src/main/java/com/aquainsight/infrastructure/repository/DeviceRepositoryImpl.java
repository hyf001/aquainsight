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
        DevicePO devicePO = deviceDao.selectByIdWithAssociations(id);
        if (devicePO == null) {
            return Optional.empty();
        }
        // MapStruct 自动处理嵌套的 site 和 deviceModel 转换
        return Optional.of(DeviceConverter.INSTANCE.toEntity(devicePO));
    }

    @Override
    public Optional<Device> findByDeviceCode(String deviceCode) {
        DevicePO devicePO = deviceDao.selectByDeviceCodeWithAssociations(deviceCode);
        if (devicePO == null) {
            return Optional.empty();
        }
        // MapStruct 自动处理嵌套的 site 和 deviceModel 转换
        return Optional.of(DeviceConverter.INSTANCE.toEntity(devicePO));
    }

    @Override
    public List<Device> findAll() {
        List<DevicePO> devicePOList = deviceDao.selectAllWithAssociations();
        // MapStruct 自动处理嵌套的 site 和 deviceModel 转换
        return DeviceConverter.INSTANCE.toEntityList(devicePOList);
    }

    @Override
    public List<Device> findBySiteId(Integer siteId) {
        List<DevicePO> devicePOList = deviceDao.selectBySiteIdWithAssociations(siteId);
        // MapStruct 自动处理嵌套的 site 和 deviceModel 转换
        return DeviceConverter.INSTANCE.toEntityList(devicePOList);
    }

    @Override
    public List<Device> findByDeviceModelId(Integer deviceModelId) {
        List<DevicePO> devicePOList = deviceDao.selectByDeviceModelIdWithAssociations(deviceModelId);
        // MapStruct 自动处理嵌套的 site 和 deviceModel 转换
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
        // 重新查询以获取完整的关联对象
        return findById(device.getId()).orElse(device);
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
        // 使用带关联查询的分页查询
        IPage<DevicePO> poPage = deviceDao.selectPageWithAssociations(page, siteId, deviceModelId);
        Page<Device> devicePage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        // MapStruct 自动处理嵌套的 site 和 deviceModel 转换
        devicePage.setRecords(DeviceConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return devicePage;
    }
}
