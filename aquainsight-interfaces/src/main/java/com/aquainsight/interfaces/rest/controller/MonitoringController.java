package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.common.util.PageResult;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.monitoring.entity.Device;
import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.domain.monitoring.entity.Factor;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.application.service.MonitoringApplicationService;
import com.aquainsight.interfaces.rest.dto.CreateDeviceModelRequest;
import com.aquainsight.interfaces.rest.dto.CreateDeviceRequest;
import com.aquainsight.interfaces.rest.dto.CreateFactorRequest;
import com.aquainsight.interfaces.rest.dto.CreateSiteRequest;
import com.aquainsight.interfaces.rest.dto.UpdateDeviceModelRequest;
import com.aquainsight.interfaces.rest.dto.UpdateDeviceRequest;
import com.aquainsight.interfaces.rest.dto.UpdateFactorRequest;
import com.aquainsight.interfaces.rest.dto.UpdateSiteRequest;
import com.aquainsight.interfaces.rest.vo.DeviceModelVO;
import com.aquainsight.interfaces.rest.vo.DeviceVO;
import com.aquainsight.interfaces.rest.vo.FactorVO;
import com.aquainsight.interfaces.rest.vo.SiteVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 监控系统控制器
 *
 * @author aquainsight
 */
@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final MonitoringApplicationService monitoringApplicationService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_ONLY_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ==================== Site Endpoints ====================

    /**
     * 创建站点
     *
     * @param request 创建站点请求
     * @return 新创建的站点
     */
    @PostMapping("/sites")
    public Response<SiteVO> createSite(@Valid @RequestBody CreateSiteRequest request) {
        try {
            Site createdSite = monitoringApplicationService.createSite(
                    request.getSiteCode(),
                    request.getSiteName(),
                    request.getSiteType(),
                    request.getSiteTag(),
                    request.getLongitude() != null ? new BigDecimal(request.getLongitude()) : null,
                    request.getLatitude() != null ? new BigDecimal(request.getLatitude()) : null,
                    request.getAddress(),
                    request.getEnterpriseId(),
                    request.getIsAutoUpload() != null ? (request.getIsAutoUpload() ? 1 : 0) : 0
            );
            return Response.success(convertToSiteVO(createdSite));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新站点
     *
     * @param id      站点ID
     * @param request 更新站点请求
     * @return 更新后的站点
     */
    @PutMapping("/sites/{id}")
    public Response<SiteVO> updateSite(@PathVariable Integer id, @RequestBody UpdateSiteRequest request) {
        try {
            Optional<Site> siteOpt = monitoringApplicationService.getSiteById(id);
            if (!siteOpt.isPresent()) {
                return Response.error("站点不存在");
            }

            Site site = siteOpt.get();
            Site updatedSite = monitoringApplicationService.updateSiteInfo(
                    id,
                    request.getSiteName(),
                    request.getSiteType(),
                    request.getSiteTag(),
                    request.getLongitude() != null ? new BigDecimal(request.getLongitude()) : site.getLongitude(),
                    request.getLatitude() != null ? new BigDecimal(request.getLatitude()) : site.getLatitude(),
                    request.getAddress(),
                    request.getEnterpriseId() != null ? request.getEnterpriseId() : (site.getEnterprise() != null ? site.getEnterprise().getId() : null),
                    request.getIsAutoUpload() != null ? (request.getIsAutoUpload() ? 1 : 0) : site.getIsAutoUpload()
            );
            return Response.success(convertToSiteVO(updatedSite));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取站点详情
     *
     * @param id 站点ID
     * @return 站点详情
     */
    @GetMapping("/sites/{id}")
    public Response<SiteVO> getSiteById(@PathVariable Integer id) {
        try {
            Optional<Site> siteOpt = monitoringApplicationService.getSiteById(id);
            if (!siteOpt.isPresent()) {
                return Response.error("站点不存在");
            }
            return Response.success(convertToSiteVO(siteOpt.get()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页获取站点列表
     *
     * @param pageNum       页码
     * @param pageSize      每页大小
     * @param siteType      站点类型
     * @param enterpriseId  企业ID
     * @return 分页站点列表
     */
    @GetMapping("/sites")
    public Response<PageResult<SiteVO>> listSites(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String siteType,
            @RequestParam(required = false) Integer enterpriseId) {
        try {
            IPage<Site> page = monitoringApplicationService.getSitePage(pageNum, pageSize, siteType, enterpriseId);

            List<SiteVO> voList = page.getRecords().stream()
                    .map(this::convertToSiteVO)
                    .collect(Collectors.toList());

            PageResult<SiteVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除站点
     *
     * @param id 站点ID
     * @return 删除结果
     */
    @DeleteMapping("/sites/{id}")
    public Response<Void> deleteSite(@PathVariable Integer id) {
        try {
            monitoringApplicationService.deleteSite(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== DeviceModel Endpoints ====================

    /**
     * 创建设备型号
     *
     * @param request 创建设备型号请求
     * @return 新创建的设备型号
     */
    @PostMapping("/device-models")
    public Response<DeviceModelVO> createDeviceModel(@Valid @RequestBody CreateDeviceModelRequest request) {
        try {
            DeviceModel createdDeviceModel = monitoringApplicationService.createDeviceModel(
                    request.getModelCode(),
                    request.getModelName(),
                    request.getDeviceType(),
                    request.getManufacturer(),
                    request.getDescription(),
                    request.getSpecifications(),
                    request.getFactorId()
            );
            return Response.success(convertToDeviceModelVO(createdDeviceModel));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新设备型号
     *
     * @param id      设备型号ID
     * @param request 更新设备型号请求
     * @return 更新后的设备型号
     */
    @PutMapping("/device-models/{id}")
    public Response<DeviceModelVO> updateDeviceModel(@PathVariable Integer id, @RequestBody UpdateDeviceModelRequest request) {
        try {
            Optional<DeviceModel> deviceModelOpt = monitoringApplicationService.getDeviceModelById(id);
            if (!deviceModelOpt.isPresent()) {
                return Response.error("设备型号不存在");
            }

            DeviceModel updatedDeviceModel = monitoringApplicationService.updateDeviceModelInfo(
                    id,
                    request.getModelName(),
                    request.getDeviceType(),
                    request.getManufacturer(),
                    request.getDescription(),
                    request.getSpecifications(),
                    request.getFactorId()
            );
            return Response.success(convertToDeviceModelVO(updatedDeviceModel));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取设备型号详情
     *
     * @param id 设备型号ID
     * @return 设备型号详情
     */
    @GetMapping("/device-models/{id}")
    public Response<DeviceModelVO> getDeviceModelById(@PathVariable Integer id) {
        try {
            Optional<DeviceModel> deviceModelOpt = monitoringApplicationService.getDeviceModelById(id);
            if (!deviceModelOpt.isPresent()) {
                return Response.error("设备型号不存在");
            }
            return Response.success(convertToDeviceModelVO(deviceModelOpt.get()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页获取设备型号列表
     *
     * @param pageNum    页码
     * @param pageSize   每页大小
     * @param deviceType 设备类型
     * @return 分页设备型号列表
     */
    @GetMapping("/device-models")
    public Response<PageResult<DeviceModelVO>> listDeviceModels(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String deviceType) {
        try {
            IPage<DeviceModel> page = monitoringApplicationService.getDeviceModelPage(pageNum, pageSize, deviceType);

            List<DeviceModelVO> voList = page.getRecords().stream()
                    .map(this::convertToDeviceModelVO)
                    .collect(Collectors.toList());

            PageResult<DeviceModelVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有设备型号（不分页）
     *
     * @return 设备型号列表
     */
    @GetMapping("/device-models/all")
    public Response<List<DeviceModelVO>> getAllDeviceModels() {
        try {
            List<DeviceModel> deviceModels = monitoringApplicationService.getAllDeviceModels();
            List<DeviceModelVO> voList = deviceModels.stream()
                    .map(this::convertToDeviceModelVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除设备型号
     *
     * @param id 设备型号ID
     * @return 删除结果
     */
    @DeleteMapping("/device-models/{id}")
    public Response<Void> deleteDeviceModel(@PathVariable Integer id) {
        try {
            monitoringApplicationService.deleteDeviceModel(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== Device Endpoints ====================

    /**
     * 创建设备
     *
     * @param request 创建设备请求
     * @return 新创建的设备
     */
    @PostMapping("/devices")
    public Response<DeviceVO> createDevice(@Valid @RequestBody CreateDeviceRequest request) {
        try {
            Device createdDevice = monitoringApplicationService.createDevice(
                    request.getDeviceCode(),
                    request.getDeviceName(),
                    request.getSiteId(),
                    request.getDeviceModelId(),
                    request.getSerialNumber(),
                    request.getInstallLocation(),
                    request.getStatus() != null ? Integer.parseInt(request.getStatus()) : 0,
                    request.getInstallDate() != null ? LocalDate.parse(request.getInstallDate(), DATE_ONLY_FORMATTER) : null,
                    request.getMaintenanceDate() != null ? LocalDate.parse(request.getMaintenanceDate(), DATE_ONLY_FORMATTER) : null
            );
            return Response.success(convertToDeviceVO(createdDevice));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新设备
     *
     * @param id      设备ID
     * @param request 更新设备请求
     * @return 更新后的设备
     */
    @PutMapping("/devices/{id}")
    public Response<DeviceVO> updateDevice(@PathVariable Integer id, @RequestBody UpdateDeviceRequest request) {
        try {
            Optional<Device> deviceOpt = monitoringApplicationService.getDeviceById(id);
            if (!deviceOpt.isPresent()) {
                return Response.error("设备不存在");
            }

            Device device = deviceOpt.get();
            Device updatedDevice = monitoringApplicationService.updateDeviceInfo(
                    id,
                    request.getDeviceName(),
                    request.getSerialNumber(),
                    request.getInstallLocation(),
                    request.getInstallDate() != null ? LocalDate.parse(request.getInstallDate(), DATE_ONLY_FORMATTER) : device.getInstallDate(),
                    request.getMaintenanceDate() != null ? LocalDate.parse(request.getMaintenanceDate(), DATE_ONLY_FORMATTER) : device.getMaintenanceDate()
            );
            return Response.success(convertToDeviceVO(updatedDevice));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 设置设备在线
     *
     * @param id 设备ID
     * @return 更新后的设备
     */
    @PutMapping("/devices/{id}/status/online")
    public Response<DeviceVO> setDeviceOnline(@PathVariable Integer id) {
        try {
            Device device = monitoringApplicationService.setDeviceOnline(id);
            return Response.success(convertToDeviceVO(device));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 设置设备离线
     *
     * @param id 设备ID
     * @return 更新后的设备
     */
    @PutMapping("/devices/{id}/status/offline")
    public Response<DeviceVO> setDeviceOffline(@PathVariable Integer id) {
        try {
            Device device = monitoringApplicationService.setDeviceOffline(id);
            return Response.success(convertToDeviceVO(device));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 设置设备故障
     *
     * @param id 设备ID
     * @return 更新后的设备
     */
    @PutMapping("/devices/{id}/status/fault")
    public Response<DeviceVO> setDeviceFault(@PathVariable Integer id) {
        try {
            Device device = monitoringApplicationService.setDeviceFault(id);
            return Response.success(convertToDeviceVO(device));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取设备详情
     *
     * @param id 设备ID
     * @return 设备详情
     */
    @GetMapping("/devices/{id}")
    public Response<DeviceVO> getDeviceById(@PathVariable Integer id) {
        try {
            Optional<Device> deviceOpt = monitoringApplicationService.getDeviceById(id);
            if (!deviceOpt.isPresent()) {
                return Response.error("设备不存在");
            }
            return Response.success(convertToDeviceVO(deviceOpt.get()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页获取设备列表
     *
     * @param pageNum      页码
     * @param pageSize     每页大小
     * @param siteId       站点ID
     * @param deviceModelId 设备型号ID
     * @return 分页设备列表
     */
    @GetMapping("/devices")
    public Response<PageResult<DeviceVO>> listDevices(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Integer siteId,
            @RequestParam(required = false) Integer deviceModelId) {
        try {
            IPage<Device> page = monitoringApplicationService.getDevicePage(pageNum, pageSize, siteId, deviceModelId);

            List<DeviceVO> voList = page.getRecords().stream()
                    .map(this::convertToDeviceVO)
                    .collect(Collectors.toList());

            PageResult<DeviceVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除设备
     *
     * @param id 设备ID
     * @return 删除结果
     */
    @DeleteMapping("/devices/{id}")
    public Response<Void> deleteDevice(@PathVariable Integer id) {
        try {
            monitoringApplicationService.deleteDevice(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== Factor Endpoints ====================

    /**
     * 创建因子
     *
     * @param request 创建因子请求
     * @return 新创建的因子
     */
    @PostMapping("/factors")
    public Response<FactorVO> createFactor(@Valid @RequestBody CreateFactorRequest request) {
        try {
            Factor createdFactor = monitoringApplicationService.createFactor(
                    request.getFactorCode(),
                    request.getNationalCode(),
                    request.getFactorName(),
                    request.getShortName(),
                    request.getDeviceModelId(),
                    request.getCategory(),
                    request.getUnit(),
                    request.getUpperLimit(),
                    request.getLowerLimit(),
                    request.getPrecisionDigits()
            );
            return Response.success(convertToFactorVO(createdFactor));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新因子
     *
     * @param id      因子ID
     * @param request 更新因子请求
     * @return 更新后的因子
     */
    @PutMapping("/factors/{id}")
    public Response<FactorVO> updateFactor(@PathVariable Integer id, @RequestBody UpdateFactorRequest request) {
        try {
            Optional<Factor> factorOpt = monitoringApplicationService.getFactorById(id);
            if (!factorOpt.isPresent()) {
                return Response.error("因子不存在");
            }

            Factor updatedFactor = monitoringApplicationService.updateFactorInfo(
                    id,
                    request.getFactorName(),
                    request.getShortName(),
                    request.getCategory(),
                    request.getUnit(),
                    request.getUpperLimit(),
                    request.getLowerLimit(),
                    request.getPrecisionDigits()
            );
            return Response.success(convertToFactorVO(updatedFactor));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取因子详情
     *
     * @param id 因子ID
     * @return 因子详情
     */
    @GetMapping("/factors/{id}")
    public Response<FactorVO> getFactorById(@PathVariable Integer id) {
        try {
            Optional<Factor> factorOpt = monitoringApplicationService.getFactorById(id);
            if (!factorOpt.isPresent()) {
                return Response.error("因子不存在");
            }
            return Response.success(convertToFactorVO(factorOpt.get()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页获取因子列表
     *
     * @param pageNum      页码
     * @param pageSize     每页大小
     * @param category     类别
     * @return 分页因子列表
     */
    @GetMapping("/factors")
    public Response<PageResult<FactorVO>> listFactors(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String category) {
        try {
            IPage<Factor> page = monitoringApplicationService.getFactorPage(pageNum, pageSize, category);

            List<FactorVO> voList = page.getRecords().stream()
                    .map(this::convertToFactorVO)
                    .collect(Collectors.toList());

            PageResult<FactorVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有因子（不分页）
     *
     * @return 因子列表
     */
    @GetMapping("/factors/all")
    public Response<List<FactorVO>> getAllFactors() {
        try {
            List<Factor> factors = monitoringApplicationService.getAllFactors();
            List<FactorVO> voList = factors.stream()
                    .map(this::convertToFactorVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除因子
     *
     * @param id 因子ID
     * @return 删除结果
     */
    @DeleteMapping("/factors/{id}")
    public Response<Void> deleteFactor(@PathVariable Integer id) {
        try {
            monitoringApplicationService.deleteFactor(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== Conversion Methods ====================

    /**
     * 将站点实体转换为VO
     */
    private SiteVO convertToSiteVO(Site site) {
        return SiteVO.builder()
                .id(site.getId())
                .siteCode(site.getSiteCode())
                .siteName(site.getSiteName())
                .siteType(site.getSiteType())
                .siteTag(site.getSiteTag())
                .longitude(site.getLongitude() != null ? site.getLongitude().toPlainString() : null)
                .latitude(site.getLatitude() != null ? site.getLatitude().toPlainString() : null)
                .address(site.getAddress())
                .enterpriseId(site.getEnterprise() != null ? site.getEnterprise().getId() : null)
                .enterpriseName(site.getEnterprise() != null ? site.getEnterprise().getEnterpriseName() : null)
                .isAutoUpload(site.getIsAutoUpload() != null && site.getIsAutoUpload() == 1)
                .createTime(site.getCreateTime() != null ? site.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(site.getUpdateTime() != null ? site.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * 将设备型号实体转换为VO
     */
    private DeviceModelVO convertToDeviceModelVO(DeviceModel deviceModel) {
        return DeviceModelVO.builder()
                .id(deviceModel.getId())
                .modelCode(deviceModel.getModelCode())
                .modelName(deviceModel.getModelName())
                .deviceType(deviceModel.getDeviceType())
                .manufacturer(deviceModel.getManufacturer())
                .description(deviceModel.getDescription())
                .specifications(deviceModel.getSpecifications())
                .factorId(deviceModel.getFactor() != null ? deviceModel.getFactor().getId() : null)
                .factor(deviceModel.getFactor() != null ? convertToFactorVO(deviceModel.getFactor()) : null)
                .createTime(deviceModel.getCreateTime() != null ? deviceModel.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(deviceModel.getUpdateTime() != null ? deviceModel.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * 将设备实体转换为VO
     */
    private DeviceVO convertToDeviceVO(Device device) {
        DeviceModel deviceModel = device.getDeviceModel();
        Factor factor = deviceModel != null ? deviceModel.getFactor() : null;

        // 构建量程字符串（基于因子的上下限）
        String range = null;
        if (factor != null && factor.getLowerLimit() != null && factor.getUpperLimit() != null) {
            range = factor.getLowerLimit().toPlainString() + "-" + factor.getUpperLimit().toPlainString();
            if (factor.getUnit() != null && !factor.getUnit().trim().isEmpty()) {
                range += factor.getUnit();
            }
        }

        return DeviceVO.builder()
                .id(device.getId())
                .deviceCode(device.getDeviceCode())
                .deviceName(device.getDeviceName())
                .siteId(device.getSite() != null ? device.getSite().getId() : null)
                .siteName(device.getSite() != null ? device.getSite().getSiteName() : null)
                .deviceModelId(deviceModel != null ? deviceModel.getId() : null)
                .modelName(deviceModel != null ? deviceModel.getModelName() : null)
                .serialNumber(device.getSerialNumber())
                .installLocation(device.getInstallLocation())
                .status(device.getStatus())
                .installDate(device.getInstallDate() != null ? device.getInstallDate().toString() : null)
                .maintenanceDate(device.getMaintenanceDate() != null ? device.getMaintenanceDate().toString() : null)
                .createTime(device.getCreateTime() != null ? device.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(device.getUpdateTime() != null ? device.getUpdateTime().format(DATE_FORMATTER) : null)
                .manufacturer(deviceModel != null ? deviceModel.getManufacturer() : null)
                .range(range)
                .factorId(factor != null ? factor.getId() : null)
                .factorName(factor != null ? factor.getFactorName() : null)
                .build();
    }

    /**
     * 将因子实体转换为VO
     */
    private FactorVO convertToFactorVO(Factor factor) {
        return FactorVO.builder()
                .id(factor.getId())
                .factorCode(factor.getFactorCode())
                .nationalCode(factor.getNationalCode())
                .factorName(factor.getFactorName())
                .shortName(factor.getShortName())
                .deviceModelId(factor.getDeviceModel() != null ? factor.getDeviceModel().getId() : null)
                .modelName(factor.getDeviceModel() != null ? factor.getDeviceModel().getModelName() : null)
                .category(factor.getCategory())
                .unit(factor.getUnit())
                .upperLimit(factor.getUpperLimit())
                .lowerLimit(factor.getLowerLimit())
                .precisionDigits(factor.getPrecisionDigits())
                .createTime(factor.getCreateTime() != null ? factor.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(factor.getUpdateTime() != null ? factor.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }
}
