package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.infrastructure.db.model.SchemePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 方案转换器
 */
@Mapper(uses = {SchemeItemConverter.class})
public interface SchemeConverter {

    SchemeConverter INSTANCE = Mappers.getMapper(SchemeConverter.class);

    /**
     * PO转Entity
     * items 字段通过 SchemeItemConverter 自动转换
     */
    Scheme toEntity(SchemePO schemePO);

    /**
     * Entity转PO
     * items 字段通过 SchemeItemConverter 自动转换
     */
    SchemePO toPO(Scheme scheme);

    /**
     * PO列表转Entity列表
     */
    List<Scheme> toEntityList(List<SchemePO> schemePOList);

    /**
     * Entity列表转PO列表
     */
    List<SchemePO> toPOList(List<Scheme> schemeList);
}
