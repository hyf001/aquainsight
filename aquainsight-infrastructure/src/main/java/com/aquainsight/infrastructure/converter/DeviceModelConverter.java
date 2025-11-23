package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.infrastructure.db.model.DeviceModelPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 设备型号转换器
 */
@Mapper
public interface DeviceModelConverter {

    DeviceModelConverter INSTANCE = Mappers.getMapper(DeviceModelConverter.class);

    /**
     * PO转Entity
     */
    DeviceModel toEntity(DeviceModelPO deviceModelPO);

    /**
     * Entity转PO
     */
    DeviceModelPO toPO(DeviceModel deviceModel);

    /**
     * PO列表转Entity列表
     */
    List<DeviceModel> toEntityList(List<DeviceModelPO> deviceModelPOList);

    /**
     * Entity列表转PO列表
     */
    List<DeviceModelPO> toPOList(List<DeviceModel> deviceModelList);
}
