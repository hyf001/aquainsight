package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.infrastructure.db.model.JobCategoryPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

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
    JobCategory toEntity(JobCategoryPO jobCategoryPO);

    /**
     * Entity转PO
     */
    JobCategoryPO toPO(JobCategory jobCategory);

    /**
     * PO列表转Entity列表
     */
    List<JobCategory> toEntityList(List<JobCategoryPO> jobCategoryPOList);

    /**
     * Entity列表转PO列表
     */
    List<JobCategoryPO> toPOList(List<JobCategory> jobCategoryList);
}
