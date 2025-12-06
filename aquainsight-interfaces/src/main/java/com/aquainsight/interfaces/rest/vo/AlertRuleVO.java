package com.aquainsight.interfaces.rest.vo;

import com.aquainsight.interfaces.rest.dto.RuleConditionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 告警规则视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRuleVO {

    private Integer id;

    private String ruleName;

    private String alertTargetType;

    private List<RuleConditionDTO> conditionConfigs;

    private Integer alertLevel;

    private String alertMessage;

    private Integer schemeId;

    private String notifyTypes;

    private String notifyUsers;

    private String notifyDepartments;

    private Integer enabled;

    private Integer quietPeriod;

    private String description;

    private String creator;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
