package com.aquainsight.domain.monitoring.service;

import com.aquainsight.domain.monitoring.entity.Device;
import com.aquainsight.domain.monitoring.repository.DeviceRepository;
import com.aquainsight.domain.monitoring.repository.DeviceModelRepository;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 设备实例领域服务
 */
@Service
@RequiredArgsConstructor
public class DeviceDomainService {

    private final DeviceRepository deviceRepository;
    private final SiteRepository siteRepository;
    private final DeviceModelRepository deviceModelRepository;

    /**
     * 创建设备实例
     */
    public Device createDevice(String deviceCode, String deviceName, Integer siteId, Integer deviceModelId,
                              String serialNumber, String installLocation, Integer status,
                              LocalDate installDate, LocalDate maintenanceDate) {
        // 领域规则验证
        if (deviceCode == null || deviceCode.trim().isEmpty()) {
            throw new IllegalArgumentException("设备编码不能为空");
        }
        if (deviceName == null || deviceName.trim().isEmpty()) {
            throw new IllegalArgumentException("设备名称不能为空");
        }
        if (siteId == null) {
            throw new IllegalArgumentException("所属站点不能为空");
        }
        if (deviceModelId == null) {
            throw new IllegalArgumentException("设备型号不能为空");
        }
        if (deviceRepository.existsByDeviceCode(deviceCode)) {
            throw new IllegalArgumentException("设备编码已存在");
        }

        // 验证站点是否存在
        if (!siteRepository.findById(siteId).isPresent()) {
            throw new IllegalArgumentException("所属站点不存在");
        }

        // 验证设备型号是否存在
        if (!deviceModelRepository.findById(deviceModelId).isPresent()) {
            throw new IllegalArgumentException("设备型号不存在");
        }

        Device device = Device.builder()
                .deviceCode(deviceCode)
                .deviceName(deviceName)
                .siteId(siteId)
                .deviceModelId(deviceModelId)
                .serialNumber(serialNumber)
                .installLocation(installLocation)
                .status(status == null ? 1 : status)
                .installDate(installDate)
                .maintenanceDate(maintenanceDate)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return deviceRepository.save(device);
    }

    /**
     * 更新设备信息
     */
    public Device updateDeviceInfo(Integer deviceId, String deviceName, String serialNumber,
                                  String installLocation, LocalDate installDate, LocalDate maintenanceDate) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (!deviceOpt.isPresent()) {
            throw new IllegalArgumentException("设备不存在");
        }

        Device device = deviceOpt.get();
        device.updateInfo(deviceName, serialNumber, installLocation, installDate, maintenanceDate);
        return deviceRepository.update(device);
    }

    /**
     * 设置设备在线状态
     */
    public Device setDeviceOnline(Integer deviceId) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (!deviceOpt.isPresent()) {
            throw new IllegalArgumentException("设备不存在");
        }

        Device device = deviceOpt.get();
        device.setOnline();
        return deviceRepository.update(device);
    }

    /**
     * 设置设备离线状态
     */
    public Device setDeviceOffline(Integer deviceId) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (!deviceOpt.isPresent()) {
            throw new IllegalArgumentException("设备不存在");
        }

        Device device = deviceOpt.get();
        device.setOffline();
        return deviceRepository.update(device);
    }

    /**
     * 设置设备故障状态
     */
    public Device setDeviceFault(Integer deviceId) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (!deviceOpt.isPresent()) {
            throw new IllegalArgumentException("设备不存在");
        }

        Device device = deviceOpt.get();
        device.setFault();
        return deviceRepository.update(device);
    }

    /**
     * 更新设备维护日期
     */
    public Device updateMaintenanceDate(Integer deviceId, LocalDate maintenanceDate) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (!deviceOpt.isPresent()) {
            throw new IllegalArgumentException("设备不存在");
        }

        Device device = deviceOpt.get();
        device.updateMaintenanceDate(maintenanceDate);
        return deviceRepository.update(device);
    }

    /**
     * 根据ID获取设备
     */
    public Optional<Device> getDeviceById(Integer deviceId) {
        return deviceRepository.findById(deviceId);
    }

    /**
     * 根据设备编码获取设备
     */
    public Optional<Device> getDeviceByDeviceCode(String deviceCode) {
        return deviceRepository.findByDeviceCode(deviceCode);
    }

    /**
     * 获取所有设备
     */
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    /**
     * 根据站点ID获取设备
     */
    public List<Device> getDevicesBySiteId(Integer siteId) {
        return deviceRepository.findBySiteId(siteId);
    }

    /**
     * 根据设备型号ID获取设备
     */
    public List<Device> getDevicesByDeviceModelId(Integer deviceModelId) {
        return deviceRepository.findByDeviceModelId(deviceModelId);
    }

    /**
     * 根据状态获取设备
     */
    public List<Device> getDevicesByStatus(Integer status) {
        return deviceRepository.findByStatus(status);
    }

    /**
     * 删除设备
     */
    public boolean deleteDevice(Integer deviceId) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (!deviceOpt.isPresent()) {
            throw new IllegalArgumentException("设备不存在");
        }
        return deviceRepository.deleteById(deviceId);
    }

    /**
     * 分页查询设备
     */
    public IPage<Device> getDevicePage(Integer pageNum, Integer pageSize, Integer siteId, Integer deviceModelId) {
        return deviceRepository.findPage(pageNum, pageSize, siteId, deviceModelId);
    }
}
