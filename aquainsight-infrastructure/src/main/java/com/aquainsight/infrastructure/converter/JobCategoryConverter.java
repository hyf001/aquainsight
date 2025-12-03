package com.aquainsight.infrastructure.converter;

import com.aquainsight.common.util.JsonUtil;
import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.types.JobParameter;
import com.aquainsight.infrastructure.db.model.JobCategoryPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.List;

/**
 * 作业类别转换器
 */
@Mapper
public interface JobCategoryConverter {

    JobCategoryConverter INSTANCE = Mappers.getMapper(JobCategoryConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(source = "parameters", target = "parameters", qualifiedByName = "stringToParameterList")
    JobCategory toEntity(JobCategoryPO jobCategoryPO);

    /**
     * Entity转PO
     */
    @Mapping(source = "parameters", target = "parameters", qualifiedByName = "parameterListToString")
    JobCategoryPO toPO(JobCategory jobCategory);

    /**
     * PO列表转Entity列表
     */
    List<JobCategory> toEntityList(List<JobCategoryPO> jobCategoryPOList);

    /**
     * Entity列表转PO列表
     */
    List<JobCategoryPO> toPOList(List<JobCategory> jobCategoryList);

    /**
     * 解析参数JSON字符串为参数列表
     */
    @Named("stringToParameterList")
    default List<JobParameter> stringToParameterList(String parametersJson) {
        if (parametersJson == null || parametersJson.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<JobParameter> result = JsonUtil.parseList(parametersJson, JobParameter.class);
        return result != null ? result : Collections.emptyList();
    }

    /**
     * 将参数列表转换为JSON字符串
     */
    @Named("parameterListToString")
    default String parameterListToString(List<JobParameter> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            return null;
        }
        return JsonUtil.toJsonString(parameters);
    }
}
