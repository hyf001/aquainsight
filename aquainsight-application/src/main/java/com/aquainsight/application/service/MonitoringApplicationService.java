package com.aquainsight.application.service;

import com.aquainsight.domain.monitoring.entity.Device;
import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.domain.monitoring.entity.Factor;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.service.DeviceDomainService;
import com.aquainsight.domain.monitoring.service.DeviceModelDomainService;
import com.aquainsight.domain.monitoring.service.FactorDomainService;
import com.aquainsight.domain.monitoring.service.SiteDomainService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MonitoringApplicationService {

    private final SiteDomainService siteDomainService;
    private final DeviceModelDomainService deviceModelDomainService;
    private final DeviceDomainService deviceDomainService;
    private final FactorDomainService factorDomainService;

    // ==================== Site Methods ====================

    @Transactional(rollbackFor = Exception.class)
    public Site createSite(String siteCode, String siteName, String siteType, String siteTag,
                          BigDecimal longitude, BigDecimal latitude, String address,
                          Integer enterpriseId, Integer isAutoUpload) {
        return siteDomainService.createSite(siteCode, siteName, siteType, siteTag,
                longitude, latitude, address, enterpriseId, isAutoUpload);
    }

    @Transactional(rollbackFor = Exception.class)
    public Site updateSiteInfo(Integer siteId, String siteName, String siteType, String siteTag,
                              BigDecimal longitude, BigDecimal latitude, String address,
                              Integer enterpriseId, Integer isAutoUpload) {
        return siteDomainService.updateSiteInfo(siteId, siteName, siteType, siteTag,
                longitude, latitude, address, enterpriseId, isAutoUpload);
    }

    public Optional<Site> getSiteById(Integer siteId) {
        return siteDomainService.getSiteById(siteId);
    }

    public List<Site> getAllSites() {
        return siteDomainService.getAllSites();
    }

    public List<Site> getSitesBySiteType(String siteType) {
        return siteDomainService.getSitesBySiteType(siteType);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean deleteSite(Integer siteId) {
        return siteDomainService.deleteSite(siteId);
    }

    public IPage<Site> getSitePage(Integer pageNum, Integer pageSize, String siteType, Integer enterpriseId) {
        return siteDomainService.getSitePage(pageNum, pageSize, siteType, enterpriseId);
    }

    // ==================== DeviceModel Methods ====================

    @Transactional(rollbackFor = Exception.class)
    public DeviceModel createDeviceModel(String modelCode, String modelName, String deviceType,
                                        String manufacturer, String description, String specifications,
                                        Integer factorId) {
        return deviceModelDomainService.createDeviceModel(modelCode, modelName, deviceType,
                manufacturer, description, specifications, factorId);
    }

    @Transactional(rollbackFor = Exception.class)
    public DeviceModel updateDeviceModelInfo(Integer deviceModelId, String modelName, String deviceType,
                                            String manufacturer, String description, String specifications,
                                            Integer factorId) {
        return deviceModelDomainService.updateDeviceModelInfo(deviceModelId, modelName, deviceType,
                manufacturer, description, specifications, factorId);
    }

    public Optional<DeviceModel> getDeviceModelById(Integer deviceModelId) {
        return deviceModelDomainService.getDeviceModelById(deviceModelId);
    }

    public List<DeviceModel> getAllDeviceModels() {
        return deviceModelDomainService.getAllDeviceModels();
    }

    public List<DeviceModel> getDeviceModelsByDeviceType(String deviceType) {
        return deviceModelDomainService.getDeviceModelsByDeviceType(deviceType);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean deleteDeviceModel(Integer deviceModelId) {
        return deviceModelDomainService.deleteDeviceModel(deviceModelId);
    }

    public IPage<DeviceModel> getDeviceModelPage(Integer pageNum, Integer pageSize, String deviceType) {
        return deviceModelDomainService.getDeviceModelPage(pageNum, pageSize, deviceType);
    }

    // ==================== Device Methods ====================

    @Transactional(rollbackFor = Exception.class)
    public Device createDevice(String deviceCode, String deviceName, Integer siteId, Integer deviceModelId,
                              String serialNumber, String installLocation, Integer status,
                              LocalDate installDate, LocalDate maintenanceDate) {
        return deviceDomainService.createDevice(deviceCode, deviceName, siteId, deviceModelId,
                serialNumber, installLocation, status, installDate, maintenanceDate);
    }

    @Transactional(rollbackFor = Exception.class)
    public Device updateDeviceInfo(Integer deviceId, String deviceName, String serialNumber,
                                  String installLocation, LocalDate installDate, LocalDate maintenanceDate) {
        return deviceDomainService.updateDeviceInfo(deviceId, deviceName, serialNumber,
                installLocation, installDate, maintenanceDate);
    }

    @Transactional(rollbackFor = Exception.class)
    public Device setDeviceOnline(Integer deviceId) {
        return deviceDomainService.setDeviceOnline(deviceId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Device setDeviceOffline(Integer deviceId) {
        return deviceDomainService.setDeviceOffline(deviceId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Device setDeviceFault(Integer deviceId) {
        return deviceDomainService.setDeviceFault(deviceId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Device updateMaintenanceDate(Integer deviceId, LocalDate maintenanceDate) {
        return deviceDomainService.updateMaintenanceDate(deviceId, maintenanceDate);
    }

    public Optional<Device> getDeviceById(Integer deviceId) {
        return deviceDomainService.getDeviceById(deviceId);
    }

    public List<Device> getAllDevices() {
        return deviceDomainService.getAllDevices();
    }

    public List<Device> getDevicesBySiteId(Integer siteId) {
        return deviceDomainService.getDevicesBySiteId(siteId);
    }

    public List<Device> getDevicesByDeviceModelId(Integer deviceModelId) {
        return deviceDomainService.getDevicesByDeviceModelId(deviceModelId);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean deleteDevice(Integer deviceId) {
        return deviceDomainService.deleteDevice(deviceId);
    }

    public IPage<Device> getDevicePage(Integer pageNum, Integer pageSize, Integer siteId, Integer deviceModelId) {
        return deviceDomainService.getDevicePage(pageNum, pageSize, siteId, deviceModelId);
    }

    // ==================== Factor Methods ====================

    @Transactional(rollbackFor = Exception.class)
    public Factor createFactor(String factorCode, String nationalCode, String factorName, String shortName,
                              Integer deviceModelId, String category, String unit,
                              BigDecimal upperLimit, BigDecimal lowerLimit, Integer precisionDigits) {
        return factorDomainService.createFactor(factorCode, nationalCode, factorName, shortName,
                deviceModelId, category, unit, upperLimit, lowerLimit, precisionDigits);
    }

    @Transactional(rollbackFor = Exception.class)
    public Factor updateFactorInfo(Integer factorId, String factorName, String shortName, String category,
                                  String unit, BigDecimal upperLimit, BigDecimal lowerLimit, Integer precisionDigits) {
        return factorDomainService.updateFactorInfo(factorId, factorName, shortName, category,
                unit, upperLimit, lowerLimit, precisionDigits);
    }

    public Optional<Factor> getFactorById(Integer factorId) {
        return factorDomainService.getFactorById(factorId);
    }

    public List<Factor> getFactorsByCategory(String category) {
        return factorDomainService.getFactorsByCategory(category);
    }

    public List<Factor> getAllFactors() {
        return factorDomainService.getAllFactors();
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean deleteFactor(Integer factorId) {
        return factorDomainService.deleteFactor(factorId);
    }

    public IPage<Factor> getFactorPage(Integer pageNum, Integer pageSize, String category) {
        return factorDomainService.getFactorPage(pageNum, pageSize, category);
    }
}
