package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.infrastructure.db.model.SchemeItemPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 方案项目转换器
 */
@Mapper(uses = JobCategoryConverter.class)
public interface SchemeItemConverter {

    SchemeItemConverter INSTANCE = Mappers.getMapper(SchemeItemConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "itemName", source = "name")
    SchemeItem toEntity(SchemeItemPO schemeItemPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "name", source = "itemName")
    @Mapping(target = "jobCategory", ignore = true)
    SchemeItemPO toPO(SchemeItem schemeItem);

    /**
     * PO列表转Entity列表
     */
    List<SchemeItem> toEntityList(List<SchemeItemPO> schemeItemPOList);

    /**
     * Entity列表转PO列表
     */
    List<SchemeItemPO> toPOList(List<SchemeItem> schemeItemList);
}
