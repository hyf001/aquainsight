package com.aquainsight.infrastructure.converter;

import com.aquainsight.common.util.JsonUtil;
import com.aquainsight.domain.maintenance.entity.StepTemplate;
import com.aquainsight.domain.maintenance.types.StepParameter;
import com.aquainsight.infrastructure.db.model.StepTemplatePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.List;

/**
 * 步骤模版转换器
 */
@Mapper
public interface StepTemplateConverter {

    StepTemplateConverter INSTANCE = Mappers.getMapper(StepTemplateConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(source = "parameters", target = "parameters", qualifiedByName = "stringToParameterList")
    StepTemplate toEntity(StepTemplatePO stepTemplatePO);

    /**
     * Entity转PO
     */
    @Mapping(source = "parameters", target = "parameters", qualifiedByName = "parameterListToString")
    StepTemplatePO toPO(StepTemplate stepTemplate);

    /**
     * PO列表转Entity列表
     */
    List<StepTemplate> toEntityList(List<StepTemplatePO> stepTemplatePOList);

    /**
     * Entity列表转PO列表
     */
    List<StepTemplatePO> toPOList(List<StepTemplate> stepTemplateList);

    /**
     * 解析参数JSON字符串为参数列表
     */
    @Named("stringToParameterList")
    default List<StepParameter> stringToParameterList(String parametersJson) {
        if (parametersJson == null || parametersJson.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<StepParameter> result = JsonUtil.parseList(parametersJson, StepParameter.class);
        return result != null ? result : Collections.emptyList();
    }

    /**
     * 将参数列表转换为JSON字符串
     */
    @Named("parameterListToString")
    default String parameterListToString(List<StepParameter> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            return null;
        }
        return JsonUtil.toJsonString(parameters);
    }
}
