package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.Device;
import com.aquainsight.infrastructure.db.model.DevicePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 设备实例转换器
 * 使用 MapStruct 嵌套映射简化转换
 */
@Mapper(uses = {SiteConverter.class, DeviceModelConverter.class})
public interface DeviceConverter {

    DeviceConverter INSTANCE = Mappers.getMapper(DeviceConverter.class);

    /**
     * PO转Entity (自动使用 SiteConverter 和 DeviceModelConverter 转换嵌套字段)
     */
    Device toEntity(DevicePO devicePO);

    /**
     * Entity转PO (从Site和DeviceModel对象提取ID，不转换site和deviceModel字段)
     */
    @Mapping(target = "siteId", expression = "java(device.getSite() != null ? device.getSite().getId() : null)")
    @Mapping(target = "site", ignore = true)
    @Mapping(target = "deviceModelId", expression = "java(device.getDeviceModel() != null ? device.getDeviceModel().getId() : null)")
    @Mapping(target = "deviceModel", ignore = true)
    DevicePO toPO(Device device);

    /**
     * PO列表转Entity列表 (自动使用 SiteConverter 和 DeviceModelConverter 转换嵌套字段)
     */
    List<Device> toEntityList(List<DevicePO> devicePOList);

    /**
     * Entity列表转PO列表
     */
    List<DevicePO> toPOList(List<Device> deviceList);
}
