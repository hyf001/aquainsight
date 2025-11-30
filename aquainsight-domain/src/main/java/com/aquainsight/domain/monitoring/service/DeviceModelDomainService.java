package com.aquainsight.domain.monitoring.service;

import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.domain.monitoring.entity.Factor;
import com.aquainsight.domain.monitoring.repository.DeviceModelRepository;
import com.aquainsight.domain.monitoring.repository.FactorRepository;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 设备型号领域服务
 */
@Service
@RequiredArgsConstructor
public class DeviceModelDomainService {

    private final DeviceModelRepository deviceModelRepository;
    private final FactorRepository factorRepository;

    /**
     * 创建设备型号
     */
    public DeviceModel createDeviceModel(String modelCode, String modelName, String deviceType,
                                        String manufacturer, String description, String specifications,
                                        Integer factorId) {
        // 领域规则验证
        if (modelCode == null || modelCode.trim().isEmpty()) {
            throw new IllegalArgumentException("型号编码不能为空");
        }
        if (modelName == null || modelName.trim().isEmpty()) {
            throw new IllegalArgumentException("型号名称不能为空");
        }
        if (deviceModelRepository.existsByModelCode(modelCode)) {
            throw new IllegalArgumentException("型号编码已存在");
        }

        // 获取关联的因子
        Factor factor = null;
        if (factorId != null) {
            Optional<Factor> factorOpt = factorRepository.findById(factorId);
            if (!factorOpt.isPresent()) {
                throw new IllegalArgumentException("关联的因子不存在");
            }
            factor = factorOpt.get();
        }

        DeviceModel deviceModel = DeviceModel.builder()
                .modelCode(modelCode)
                .modelName(modelName)
                .deviceType(deviceType)
                .manufacturer(manufacturer)
                .description(description)
                .specifications(specifications)
                .factor(factor)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return deviceModelRepository.save(deviceModel);
    }

    /**
     * 更新设备型号信息
     */
    public DeviceModel updateDeviceModelInfo(Integer deviceModelId, String modelName, String deviceType,
                                            String manufacturer, String description, String specifications,
                                            Integer factorId) {
        Optional<DeviceModel> deviceModelOpt = deviceModelRepository.findById(deviceModelId);
        if (!deviceModelOpt.isPresent()) {
            throw new IllegalArgumentException("设备型号不存在");
        }

        // 获取关联的因子
        Factor factor = null;
        if (factorId != null) {
            Optional<Factor> factorOpt = factorRepository.findById(factorId);
            if (!factorOpt.isPresent()) {
                throw new IllegalArgumentException("关联的因子不存在");
            }
            factor = factorOpt.get();
        }

        DeviceModel deviceModel = deviceModelOpt.get();
        deviceModel.updateInfo(modelName, deviceType, manufacturer, description, specifications, factor);
        return deviceModelRepository.update(deviceModel);
    }

    /**
     * 根据ID获取设备型号
     */
    public Optional<DeviceModel> getDeviceModelById(Integer deviceModelId) {
        return deviceModelRepository.findById(deviceModelId);
    }

    /**
     * 根据型号编码获取设备型号
     */
    public Optional<DeviceModel> getDeviceModelByModelCode(String modelCode) {
        return deviceModelRepository.findByModelCode(modelCode);
    }

    /**
     * 获取所有设备型号
     */
    public List<DeviceModel> getAllDeviceModels() {
        return deviceModelRepository.findAll();
    }

    /**
     * 根据设备类型获取设备型号
     */
    public List<DeviceModel> getDeviceModelsByDeviceType(String deviceType) {
        return deviceModelRepository.findByDeviceType(deviceType);
    }

    /**
     * 根据制造商获取设备型号
     */
    public List<DeviceModel> getDeviceModelsByManufacturer(String manufacturer) {
        return deviceModelRepository.findByManufacturer(manufacturer);
    }

    /**
     * 删除设备型号
     */
    public boolean deleteDeviceModel(Integer deviceModelId) {
        Optional<DeviceModel> deviceModelOpt = deviceModelRepository.findById(deviceModelId);
        if (!deviceModelOpt.isPresent()) {
            throw new IllegalArgumentException("设备型号不存在");
        }
        return deviceModelRepository.deleteById(deviceModelId);
    }

    /**
     * 分页查询设备型号
     */
    public IPage<DeviceModel> getDeviceModelPage(Integer pageNum, Integer pageSize, String deviceType) {
        return deviceModelRepository.findPage(pageNum, pageSize, deviceType);
    }
}
