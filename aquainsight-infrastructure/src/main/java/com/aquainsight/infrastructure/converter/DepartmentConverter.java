package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.infrastructure.db.model.DepartmentPO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 部门转换器
 *
 * @author aquainsight
 */
@Mapper
public interface DepartmentConverter {

    DepartmentConverter INSTANCE = Mappers.getMapper(DepartmentConverter.class);

    /**
     * PO转Entity
     *
     * @param departmentPO 部门PO
     * @return 部门实体
     */
    @Mapping(target = "children", ignore = true)
    Department toEntity(DepartmentPO departmentPO);

    /**
     * Entity转PO
     *
     * @param department 部门实体
     * @return 部门PO
     */
    DepartmentPO toPO(Department department);

    /**
     * PO列表转Entity列表
     *
     * @param departmentPOList 部门PO列表
     * @return 部门实体列表
     */
    List<Department> toEntityList(List<DepartmentPO> departmentPOList);

    /**
     * Entity列表转PO列表
     *
     * @param departmentList 部门实体列表
     * @return 部门PO列表
     */
    List<DepartmentPO> toPOList(List<Department> departmentList);
}
