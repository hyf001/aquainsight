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
    @Mapping(source = "alertLevel", target = "alertLevel", qualifiedByName = "integerToAlertLevel")
    @Mapping(source = "status", target = "status", qualifiedByName = "integerToAlertStatus")
    @Mapping(source = "notifyStatus", target = "notifyStatus", qualifiedByName = "integerToNotifyStatus")
    AlertRecord toEntity(AlertRecordPO alertRecordPO);

    /**
     * Entity转PO
     */
    @Mapping(source = "ruleType", target = "ruleType", qualifiedByName = "ruleTypeToString")
    @Mapping(source = "targetType", target = "targetType", qualifiedByName = "targetTypeToString")
    @Mapping(source = "alertLevel", target = "alertLevel", qualifiedByName = "alertLevelToInteger")
    @Mapping(source = "status", target = "status", qualifiedByName = "alertStatusToInteger")
    @Mapping(source = "notifyStatus", target = "notifyStatus", qualifiedByName = "notifyStatusToInteger")
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
     * Integer转告警级别
     */
    @Named("integerToAlertLevel")
    default AlertLevel integerToAlertLevel(Integer alertLevel) {
        if (alertLevel == null) {
            return null;
        }
        return AlertLevel.fromCode(alertLevel);
    }

    /**
     * 告警级别转Integer
     */
    @Named("alertLevelToInteger")
    default Integer alertLevelToInteger(AlertLevel alertLevel) {
        return alertLevel == null ? null : alertLevel.getCode();
    }

    /**
     * Integer转告警状态
     */
    @Named("integerToAlertStatus")
    default AlertStatus integerToAlertStatus(Integer status) {
        if (status == null) {
            return null;
        }
        return AlertStatus.fromCode(status);
    }

    /**
     * 告警状态转Integer
     */
    @Named("alertStatusToInteger")
    default Integer alertStatusToInteger(AlertStatus status) {
        return status == null ? null : status.getCode();
    }

    /**
     * Integer转通知状态
     */
    @Named("integerToNotifyStatus")
    default NotifyStatus integerToNotifyStatus(Integer notifyStatus) {
        if (notifyStatus == null) {
            return null;
        }
        return NotifyStatus.fromCode(notifyStatus);
    }

    /**
     * 通知状态转Integer
     */
    @Named("notifyStatusToInteger")
    default Integer notifyStatusToInteger(NotifyStatus notifyStatus) {
        return notifyStatus == null ? null : notifyStatus.getCode();
    }
}
