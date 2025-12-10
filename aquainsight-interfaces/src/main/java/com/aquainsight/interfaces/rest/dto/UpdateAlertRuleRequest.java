package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import java.util.List;

/**
 * 更新告警规则请求
 */
@Data
public class UpdateAlertRuleRequest {

    private String ruleName;

    private String alertTargetType;

    private List<RuleConditionDTO> conditionConfigs;

    private Integer alertLevel;

    private String alertMessage;

    private Integer taskTemplateId;

    private String notifyTypes;

    private String notifyUsers;

    private String notifyDepartments;

    private Integer quietPeriod;

    private String description;
}
