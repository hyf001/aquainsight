package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import com.aquainsight.infrastructure.db.model.AlertNotifyLogPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 告警通知日志转换器
 */
@Mapper
public interface AlertNotifyLogConverter {

    AlertNotifyLogConverter INSTANCE = Mappers.getMapper(AlertNotifyLogConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(source = "notifyType", target = "notifyType", qualifiedByName = "stringToNotifyType")
    @Mapping(source = "status", target = "notifyStatus", qualifiedByName = "stringToNotifyStatus")
    @Mapping(source = "receiver", target = "notifyTarget")
    @Mapping(source = "content", target = "notifyContent")
    @Mapping(source = "notifyTime", target = "sendTime")
    @Mapping(source = "failureReason", target = "errorMessage")
    @Mapping(target = "notifyUserId", ignore = true)
    @Mapping(target = "notifyUserName", ignore = true)
    AlertNotifyLog toEntity(AlertNotifyLogPO alertNotifyLogPO);

    /**
     * Entity转PO
     */
    @Mapping(source = "notifyType", target = "notifyType", qualifiedByName = "notifyTypeToString")
    @Mapping(source = "notifyStatus", target = "status", qualifiedByName = "notifyStatusToString")
    @Mapping(source = "notifyTarget", target = "receiver")
    @Mapping(source = "notifyContent", target = "content")
    @Mapping(source = "sendTime", target = "notifyTime")
    @Mapping(source = "errorMessage", target = "failureReason")
    AlertNotifyLogPO toPO(AlertNotifyLog alertNotifyLog);

    /**
     * PO列表转Entity列表
     */
    List<AlertNotifyLog> toEntityList(List<AlertNotifyLogPO> alertNotifyLogPOList);

    /**
     * Entity列表转PO列表
     */
    List<AlertNotifyLogPO> toPOList(List<AlertNotifyLog> alertNotifyLogList);

    /**
     * 字符串转通知类型
     */
    @Named("stringToNotifyType")
    default NotifyType stringToNotifyType(String notifyType) {
        if (notifyType == null || notifyType.trim().isEmpty()) {
            return null;
        }
        return NotifyType.fromCode(notifyType);
    }

    /**
     * 通知类型转字符串
     */
    @Named("notifyTypeToString")
    default String notifyTypeToString(NotifyType notifyType) {
        return notifyType == null ? null : notifyType.getCode();
    }

    /**
     * 字符串转通知状态
     */
    @Named("stringToNotifyStatus")
    default NotifyStatus stringToNotifyStatus(String notifyStatus) {
        if (notifyStatus == null || notifyStatus.trim().isEmpty()) {
            return null;
        }
        return NotifyStatus.valueOf(notifyStatus);
    }

    /**
     * 通知状态转字符串
     */
    @Named("notifyStatusToString")
    default String notifyStatusToString(NotifyStatus notifyStatus) {
        return notifyStatus == null ? null : notifyStatus.name();
    }
}
