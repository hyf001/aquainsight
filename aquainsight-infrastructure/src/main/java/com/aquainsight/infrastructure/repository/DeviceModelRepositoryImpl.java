package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.domain.monitoring.repository.DeviceModelRepository;
import com.aquainsight.infrastructure.converter.DeviceModelConverter;
import com.aquainsight.infrastructure.db.dao.DeviceModelDao;
import com.aquainsight.infrastructure.db.model.DeviceModelPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 设备型号仓储实现
 */
@Repository
@RequiredArgsConstructor
public class DeviceModelRepositoryImpl implements DeviceModelRepository {

    private final DeviceModelDao deviceModelDao;

    @Override
    public DeviceModel save(DeviceModel deviceModel) {
        DeviceModelPO deviceModelPO = DeviceModelConverter.INSTANCE.toPO(deviceModel);
        deviceModelDao.insert(deviceModelPO);
        return DeviceModelConverter.INSTANCE.toEntity(deviceModelPO);
    }

    @Override
    public Optional<DeviceModel> findById(Integer id) {
        DeviceModelPO deviceModelPO = deviceModelDao.selectById(id);
        return Optional.ofNullable(deviceModelPO).map(DeviceModelConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<DeviceModel> findByModelCode(String modelCode) {
        LambdaQueryWrapper<DeviceModelPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DeviceModelPO::getModelCode, modelCode);
        DeviceModelPO deviceModelPO = deviceModelDao.selectOne(wrapper);
        return Optional.ofNullable(deviceModelPO).map(DeviceModelConverter.INSTANCE::toEntity);
    }

    @Override
    public List<DeviceModel> findAll() {
        List<DeviceModelPO> deviceModelPOList = deviceModelDao.selectList(null);
        return DeviceModelConverter.INSTANCE.toEntityList(deviceModelPOList);
    }

    @Override
    public List<DeviceModel> findByDeviceType(String deviceType) {
        LambdaQueryWrapper<DeviceModelPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DeviceModelPO::getDeviceType, deviceType);
        List<DeviceModelPO> deviceModelPOList = deviceModelDao.selectList(wrapper);
        return DeviceModelConverter.INSTANCE.toEntityList(deviceModelPOList);
    }

    @Override
    public List<DeviceModel> findByManufacturer(String manufacturer) {
        LambdaQueryWrapper<DeviceModelPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DeviceModelPO::getManufacturer, manufacturer);
        List<DeviceModelPO> deviceModelPOList = deviceModelDao.selectList(wrapper);
        return DeviceModelConverter.INSTANCE.toEntityList(deviceModelPOList);
    }

    @Override
    public DeviceModel update(DeviceModel deviceModel) {
        DeviceModelPO deviceModelPO = DeviceModelConverter.INSTANCE.toPO(deviceModel);
        deviceModelDao.updateById(deviceModelPO);
        return DeviceModelConverter.INSTANCE.toEntity(deviceModelPO);
    }

    @Override
    public boolean deleteById(Integer id) {
        return deviceModelDao.deleteById(id) > 0;
    }

    @Override
    public boolean existsByModelCode(String modelCode) {
        LambdaQueryWrapper<DeviceModelPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DeviceModelPO::getModelCode, modelCode);
        return deviceModelDao.selectCount(wrapper) > 0;
    }

    @Override
    public IPage<DeviceModel> findPage(Integer pageNum, Integer pageSize, String deviceType) {
        Page<DeviceModelPO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<DeviceModelPO> wrapper = new LambdaQueryWrapper<>();

        if (deviceType != null && !deviceType.trim().isEmpty()) {
            wrapper.eq(DeviceModelPO::getDeviceType, deviceType);
        }

        IPage<DeviceModelPO> poPage = deviceModelDao.selectPage(page, wrapper);
        Page<DeviceModel> deviceModelPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        deviceModelPage.setRecords(DeviceModelConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return deviceModelPage;
    }
}
