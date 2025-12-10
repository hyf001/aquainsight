package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 创建告警规则请求
 */
@Data
public class CreateAlertRuleRequest {

    @NotBlank(message = "规则名称不能为空")
    private String ruleName;

    @NotBlank(message = "告警对象类型不能为空")
    private String alertTargetType;

    @NotNull(message = "条件配置不能为空")
    private List<RuleConditionDTO> conditionConfigs;

    @NotNull(message = "告警级别不能为空")
    private Integer alertLevel;

    @NotBlank(message = "告警消息不能为空")
    private String alertMessage;

    private Integer taskTemplateId;

    private String notifyTypes;

    private String notifyUsers;

    private String notifyDepartments;

    private Integer quietPeriod;

    private String description;
}
