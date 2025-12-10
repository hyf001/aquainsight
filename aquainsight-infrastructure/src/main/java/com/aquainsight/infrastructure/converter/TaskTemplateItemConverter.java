package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;
import com.aquainsight.infrastructure.db.model.TaskTemplateItemPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 任务模版项目转换器
 */
@Mapper(uses = StepTemplateConverter.class)
public interface TaskTemplateItemConverter {

    TaskTemplateItemConverter INSTANCE = Mappers.getMapper(TaskTemplateItemConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "itemName", source = "name")
    TaskTemplateItem toEntity(TaskTemplateItemPO taskTemplateItemPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "name", source = "itemName")
    @Mapping(target = "stepTemplate", ignore = true)
    TaskTemplateItemPO toPO(TaskTemplateItem taskTemplateItem);

    /**
     * PO列表转Entity列表
     */
    List<TaskTemplateItem> toEntityList(List<TaskTemplateItemPO> taskTemplateItemPOList);

    /**
     * Entity列表转PO列表
     */
    List<TaskTemplateItemPO> toPOList(List<TaskTemplateItem> taskTemplateItemList);
}
