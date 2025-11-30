package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.Enterprise;
import com.aquainsight.infrastructure.db.model.EnterprisePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * 企业转换器
 */
@Mapper
public interface EnterpriseConverter {

    EnterpriseConverter INSTANCE = Mappers.getMapper(EnterpriseConverter.class);

    /**
     * PO转Entity
     */
    Enterprise toEntity(EnterprisePO po);

    /**
     * Entity转PO
     */
    EnterprisePO toPO(Enterprise entity);
}
