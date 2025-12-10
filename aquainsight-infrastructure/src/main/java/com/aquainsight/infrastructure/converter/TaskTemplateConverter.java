package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.TaskTemplate;
import com.aquainsight.infrastructure.db.model.TaskTemplatePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 任务模版转换器
 */
@Mapper(uses = {TaskTemplateItemConverter.class})
public interface TaskTemplateConverter {

    TaskTemplateConverter INSTANCE = Mappers.getMapper(TaskTemplateConverter.class);

    /**
     * PO转Entity
     * items 字段通过 TaskTemplateItemConverter 自动转换
     */
    TaskTemplate toEntity(TaskTemplatePO taskTemplatePO);

    /**
     * Entity转PO
     * items 字段通过 TaskTemplateItemConverter 自动转换
     */
    TaskTemplatePO toPO(TaskTemplate taskTemplate);

    /**
     * PO列表转Entity列表
     */
    List<TaskTemplate> toEntityList(List<TaskTemplatePO> taskTemplatePOList);

    /**
     * Entity列表转PO列表
     */
    List<TaskTemplatePO> toPOList(List<TaskTemplate> taskTemplateList);
}
