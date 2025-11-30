package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.infrastructure.db.model.DeviceModelPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 设备型号转换器
 */
@Mapper(uses = FactorConverter.class)
public interface DeviceModelConverter {

    DeviceModelConverter INSTANCE = Mappers.getMapper(DeviceModelConverter.class);

    /**
     * PO转Entity (MapStruct 自动处理嵌套的 factor 转换)
     */
    DeviceModel toEntity(DeviceModelPO deviceModelPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "factorId", expression = "java(deviceModel.getFactor() != null ? deviceModel.getFactor().getId() : null)")
    @Mapping(target = "factor", ignore = true)
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
