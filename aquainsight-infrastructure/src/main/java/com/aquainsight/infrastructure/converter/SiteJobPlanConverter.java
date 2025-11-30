package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.types.JobPlanState;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.infrastructure.db.model.SiteJobPlanPO;
import com.alibaba.fastjson2.JSON;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 站点任务计划转换器
 */
@Mapper(uses = {SiteConverter.class, SchemeConverter.class, DepartmentConverter.class})
public interface SiteJobPlanConverter {

    SiteJobPlanConverter INSTANCE = Mappers.getMapper(SiteJobPlanConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "periodConfig", source = "periodConfig", qualifiedByName = "jsonToPeriodConfig")
    @Mapping(target = "jobPlanState", source = "jobPlanState", qualifiedByName = "stringToJobPlanState")
    SiteJobPlan toEntity(SiteJobPlanPO siteJobPlanPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "periodConfig", source = "periodConfig", qualifiedByName = "periodConfigToJson")
    @Mapping(target = "jobPlanState", source = "jobPlanState", qualifiedByName = "jobPlanStateToString")
    @Mapping(target = "siteId", expression = "java(siteJobPlan.getSite() != null ? siteJobPlan.getSite().getId() : null)")
    @Mapping(target = "schemeId", expression = "java(siteJobPlan.getScheme() != null ? siteJobPlan.getScheme().getId() : null)")
    @Mapping(target = "departmentId", expression = "java(siteJobPlan.getDepartment() != null ? siteJobPlan.getDepartment().getId() : null)")
    @Mapping(target = "site", ignore = true)
    @Mapping(target = "scheme", ignore = true)
    @Mapping(target = "department", ignore = true)
    SiteJobPlanPO toPO(SiteJobPlan siteJobPlan);

    /**
     * PO列表转Entity列表
     */
    List<SiteJobPlan> toEntityList(List<SiteJobPlanPO> siteJobPlanPOList);

    /**
     * JSON字符串转周期配置对象
     */
    @Named("jsonToPeriodConfig")
    default PeriodConfig jsonToPeriodConfig(String periodConfig) {
        if (periodConfig == null || periodConfig.trim().isEmpty()) {
            return null;
        }
        return JSON.parseObject(periodConfig, PeriodConfig.class);
    }

    /**
     * 周期配置对象转JSON字符串
     */
    @Named("periodConfigToJson")
    default String periodConfigToJson(PeriodConfig periodConfig) {
        if (periodConfig == null) {
            return null;
        }
        return JSON.toJSONString(periodConfig);
    }

    /**
     * 字符串转任务计划状态枚举
     */
    @Named("stringToJobPlanState")
    default JobPlanState stringToJobPlanState(String jobPlanState) {
        if (jobPlanState == null || jobPlanState.trim().isEmpty()) {
            return null;
        }
        try {
            return JobPlanState.valueOf(jobPlanState);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * 任务计划状态枚举转字符串
     */
    @Named("jobPlanStateToString")
    default String jobPlanStateToString(JobPlanState jobPlanState) {
        if (jobPlanState == null) {
            return null;
        }
        return jobPlanState.name();
    }
}
