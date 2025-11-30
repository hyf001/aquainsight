package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.infrastructure.db.model.SchemePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 方案转换器
 */
@Mapper
public interface SchemeConverter {

    SchemeConverter INSTANCE = Mappers.getMapper(SchemeConverter.class);

    /**
     * PO转Entity
     * items 字段在 Repository 层手动填充
     */
    Scheme toEntity(SchemePO schemePO);

    /**
     * Entity转PO
     * items 字段不存在于 SchemePO，由 MapStruct 自动忽略
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
