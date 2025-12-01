package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import com.aquainsight.infrastructure.db.model.SiteJobInstancePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 站点任务实例转换器
 */
@Mapper(uses = {SiteJobPlanConverter.class})
public interface SiteJobInstanceConverter {

    SiteJobInstanceConverter INSTANCE = Mappers.getMapper(SiteJobInstanceConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "status", source = "status", qualifiedByName = "stringToStatus")
    SiteJobInstance toEntity(SiteJobInstancePO siteJobInstancePO);

    /**
     * Entity转PO
     */
    @Mapping(target = "status", source = "status", qualifiedByName = "statusToString")
    @Mapping(target = "siteJobPlanId", expression = "java(siteJobInstance.getSiteJobPlan() != null ? siteJobInstance.getSiteJobPlan().getId() : null)")
    @Mapping(target = "siteJobPlan", ignore = true)
    SiteJobInstancePO toPO(SiteJobInstance siteJobInstance);

    /**
     * PO列表转Entity列表
     */
    List<SiteJobInstance> toEntityList(List<SiteJobInstancePO> siteJobInstancePOList);

    /**
     * 字符串转状态枚举
     */
    @Named("stringToStatus")
    default JobInstanceStatus stringToStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }
        return JobInstanceStatus.valueOf(status);
    }

    /**
     * 状态枚举转字符串
     */
    @Named("statusToString")
    default String statusToString(JobInstanceStatus status) {
        if (status == null) {
            return null;
        }
        return status.name();
    }
}
