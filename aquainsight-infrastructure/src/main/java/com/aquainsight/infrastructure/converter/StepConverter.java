package com.aquainsight.infrastructure.converter;

import com.aquainsight.common.util.JsonUtil;
import com.aquainsight.domain.maintenance.entity.Step;
import com.aquainsight.domain.maintenance.types.ParameterValue;
import com.aquainsight.infrastructure.db.model.StepPO;
import com.alibaba.fastjson2.TypeReference;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 步骤转换器
 */
@Mapper
public interface StepConverter {

    StepConverter INSTANCE = Mappers.getMapper(StepConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "parameters", source = "parameters", qualifiedByName = "jsonToParameterList")
    Step toEntity(StepPO stepPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "parameters", source = "parameters", qualifiedByName = "parameterListToJson")
    StepPO toPO(Step step);

    /**
     * PO列表转Entity列表
     */
    List<Step> toEntityList(List<StepPO> stepPOList);

    /**
     * Entity列表转PO列表
     */
    List<StepPO> toPOList(List<Step> steps);

    /**
     * JSON字符串转参数列表
     */
    @Named("jsonToParameterList")
    default List<ParameterValue> jsonToParameterList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        return JsonUtil.parseObject(json, new TypeReference<List<ParameterValue>>() {});
    }

    /**
     * 参数列表转JSON字符串
     */
    @Named("parameterListToJson")
    default String parameterListToJson(List<ParameterValue> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            return null;
        }
        return JsonUtil.toJsonString(parameters);
    }
}
