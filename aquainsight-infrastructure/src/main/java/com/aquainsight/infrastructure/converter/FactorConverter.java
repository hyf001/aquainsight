package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.Factor;
import com.aquainsight.infrastructure.db.model.FactorPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 监测因子转换器
 */
@Mapper
public interface FactorConverter {

    FactorConverter INSTANCE = Mappers.getMapper(FactorConverter.class);

    /**
     * PO转Entity
     */
    Factor toEntity(FactorPO factorPO);

    /**
     * Entity转PO
     */
    FactorPO toPO(Factor factor);

    /**
     * PO列表转Entity列表 (自动使用 DeviceModelConverter 转换 deviceModel 字段)
     */
    List<Factor> toEntityList(List<FactorPO> factorPOList);

    /**
     * Entity列表转PO列表
     */
    List<FactorPO> toPOList(List<Factor> factorList);
}
