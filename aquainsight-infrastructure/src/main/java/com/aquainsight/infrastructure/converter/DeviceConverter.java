package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.Device;
import com.aquainsight.infrastructure.db.model.DevicePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 设备实例转换器
 */
@Mapper
public interface DeviceConverter {

    DeviceConverter INSTANCE = Mappers.getMapper(DeviceConverter.class);

    /**
     * PO转Entity
     */
    Device toEntity(DevicePO devicePO);

    /**
     * Entity转PO
     */
    DevicePO toPO(Device device);

    /**
     * PO列表转Entity列表
     */
    List<Device> toEntityList(List<DevicePO> devicePOList);

    /**
     * Entity列表转PO列表
     */
    List<DevicePO> toPOList(List<Device> deviceList);
}
