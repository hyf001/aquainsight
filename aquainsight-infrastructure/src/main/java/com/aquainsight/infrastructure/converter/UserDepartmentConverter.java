package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.user.entity.UserDepartment;
import com.aquainsight.infrastructure.db.model.UserDepartmentPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 用户-部门关系转换器
 *
 * @author aquainsight
 */
@Mapper
public interface UserDepartmentConverter {

    UserDepartmentConverter INSTANCE = Mappers.getMapper(UserDepartmentConverter.class);

    /**
     * PO转实体
     */
    UserDepartment toEntity(UserDepartmentPO po);

    /**
     * 实体转PO
     */
    UserDepartmentPO toPO(UserDepartment entity);

    /**
     * PO列表转实体列表
     */
    List<UserDepartment> toEntityList(List<UserDepartmentPO> poList);
}
