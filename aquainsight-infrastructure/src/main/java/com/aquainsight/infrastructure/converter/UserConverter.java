package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.user.entity.User;
import com.aquainsight.infrastructure.db.model.UserPO;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 用户转换器
 *
 * @author aquainsight
 */
@Mapper
public interface UserConverter {

    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);

    /**
     * PO转Entity
     *
     * @param userPO 用户PO
     * @return 用户实体
     */
    User toEntity(UserPO userPO);

    /**
     * Entity转PO
     *
     * @param user 用户实体
     * @return 用户PO
     */
    UserPO toPO(User user);

    /**
     * PO列表转Entity列表
     *
     * @param userPOList 用户PO列表
     * @return 用户实体列表
     */
    List<User> toEntityList(List<UserPO> userPOList);

    /**
     * Entity列表转PO列表
     *
     * @param userList 用户实体列表
     * @return 用户PO列表
     */
    List<UserPO> toPOList(List<User> userList);
}
