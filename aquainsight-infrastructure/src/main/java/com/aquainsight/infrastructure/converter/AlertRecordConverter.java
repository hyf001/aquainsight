package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertRuleType;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.infrastructure.db.model.AlertRecordPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 告警记录转换器
 */
@Mapper
public interface AlertRecordConverter {

    AlertRecordConverter INSTANCE = Mappers.getMapper(AlertRecordConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(source = "ruleType", target = "ruleType", qualifiedByName = "stringToRuleType")
    @Mapping(source = "targetType", target = "targetType", qualifiedByName = "stringToTargetType")
    @Mapping(source = "alertLevel", target = "alertLevel", qualifiedByName = "stringToAlertLevel")
    @Mapping(source = "status", target = "status", qualifiedByName = "stringToAlertStatus")
    @Mapping(source = "notifyStatus", target = "notifyStatus", qualifiedByName = "stringToNotifyStatus")
    AlertRecord toEntity(AlertRecordPO alertRecordPO);

    /**
     * Entity转PO
     */
    @Mapping(source = "ruleType", target = "ruleType", qualifiedByName = "ruleTypeToString")
    @Mapping(source = "targetType", target = "targetType", qualifiedByName = "targetTypeToString")
    @Mapping(source = "alertLevel", target = "alertLevel", qualifiedByName = "alertLevelToString")
    @Mapping(source = "status", target = "status", qualifiedByName = "alertStatusToString")
    @Mapping(source = "notifyStatus", target = "notifyStatus", qualifiedByName = "notifyStatusToString")
    AlertRecordPO toPO(AlertRecord alertRecord);

    /**
     * PO列表转Entity列表
     */
    List<AlertRecord> toEntityList(List<AlertRecordPO> alertRecordPOList);

    /**
     * Entity列表转PO列表
     */
    List<AlertRecordPO> toPOList(List<AlertRecord> alertRecordList);

    /**
     * 字符串转规则类型
     */
    @Named("stringToRuleType")
    default AlertRuleType stringToRuleType(String ruleType) {
        if (ruleType == null || ruleType.trim().isEmpty()) {
            return null;
        }
        return AlertRuleType.valueOf(ruleType);
    }

    /**
     * 规则类型转字符串
     */
    @Named("ruleTypeToString")
    default String ruleTypeToString(AlertRuleType ruleType) {
        return ruleType == null ? null : ruleType.name();
    }

    /**
     * 字符串转目标类型
     */
    @Named("stringToTargetType")
    default AlertTargetType stringToTargetType(String targetType) {
        if (targetType == null || targetType.trim().isEmpty()) {
            return null;
        }
        return AlertTargetType.fromCode(targetType);
    }

    /**
     * 目标类型转字符串
     */
    @Named("targetTypeToString")
    default String targetTypeToString(AlertTargetType targetType) {
        return targetType == null ? null : targetType.getCode();
    }

    /**
     * 字符串转告警级别
     */
    @Named("stringToAlertLevel")
    default AlertLevel stringToAlertLevel(String alertLevel) {
        if (alertLevel == null || alertLevel.trim().isEmpty()) {
            return null;
        }
        return AlertLevel.valueOf(alertLevel);
    }

    /**
     * 告警级别转字符串
     */
    @Named("alertLevelToString")
    default String alertLevelToString(AlertLevel alertLevel) {
        return alertLevel == null ? null : alertLevel.name();
    }

    /**
     * 字符串转告警状态
     */
    @Named("stringToAlertStatus")
    default AlertStatus stringToAlertStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }
        return AlertStatus.valueOf(status);
    }

    /**
     * 告警状态转字符串
     */
    @Named("alertStatusToString")
    default String alertStatusToString(AlertStatus status) {
        return status == null ? null : status.name();
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
