package com.aquainsight.infrastructure.converter;

import com.aquainsight.common.util.JsonUtil;
import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.entity.RuleCondition;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.infrastructure.db.model.AlertRulePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.List;

/**
 * 告警规则转换器
 */
@Mapper
public interface AlertRuleConverter {

    AlertRuleConverter INSTANCE = Mappers.getMapper(AlertRuleConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(source = "alertTargetType", target = "alertTargetType", qualifiedByName = "stringToTargetType")
    @Mapping(source = "alertLevel", target = "alertLevel", qualifiedByName = "integerToAlertLevel")
    @Mapping(source = "conditionConfigs", target = "conditionConfigs", qualifiedByName = "stringToConditionList")
    AlertRule toEntity(AlertRulePO alertRulePO);

    /**
     * Entity转PO
     */
    @Mapping(source = "alertTargetType", target = "alertTargetType", qualifiedByName = "targetTypeToString")
    @Mapping(source = "alertLevel", target = "alertLevel", qualifiedByName = "alertLevelToInteger")
    @Mapping(source = "conditionConfigs", target = "conditionConfigs", qualifiedByName = "conditionListToString")
    AlertRulePO toPO(AlertRule alertRule);

    /**
     * PO列表转Entity列表
     */
    List<AlertRule> toEntityList(List<AlertRulePO> alertRulePOList);

    /**
     * Entity列表转PO列表
     */
    List<AlertRulePO> toPOList(List<AlertRule> alertRuleList);

    /**
     * 字符串转告警对象类型
     */
    @Named("stringToTargetType")
    default AlertTargetType stringToTargetType(String alertTargetType) {
        if (alertTargetType == null || alertTargetType.trim().isEmpty()) {
            return null;
        }
        return AlertTargetType.fromCode(alertTargetType);
    }

    /**
     * 告警对象类型转字符串
     */
    @Named("targetTypeToString")
    default String targetTypeToString(AlertTargetType alertTargetType) {
        return alertTargetType == null ? null : alertTargetType.getCode();
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
     * 解析条件配置JSON字符串为条件列表
     */
    @Named("stringToConditionList")
    default List<RuleCondition> stringToConditionList(String conditionConfigsJson) {
        if (conditionConfigsJson == null || conditionConfigsJson.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<RuleCondition> result = JsonUtil.parseList(conditionConfigsJson, RuleCondition.class);
        return result != null ? result : Collections.emptyList();
    }

    /**
     * 将条件列表转换为JSON字符串
     */
    @Named("conditionListToString")
    default String conditionListToString(List<RuleCondition> conditionConfigs) {
        if (conditionConfigs == null || conditionConfigs.isEmpty()) {
            return null;
        }
        return JsonUtil.toJsonString(conditionConfigs);
    }
}
