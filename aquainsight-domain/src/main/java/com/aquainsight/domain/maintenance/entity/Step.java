package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.ParameterValue;
import com.aquainsight.domain.maintenance.types.StepParameter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 步骤执行
 * 一个 Step 属于一个 Task
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Step {

    /**
     * 步骤ID
     */
    private Integer id;

    /**
     * 所属任务ID
     */
    private Integer taskId;

    /**
     * 步骤模板ID（快照）
     */
    private Integer stepTemplateId;

    /**
     * 步骤名称（快照）
     */
    private String stepName;

    /**
     * 参数填写值列表
     */
    private List<ParameterValue> parameters;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 最后更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 获取指定参数的值
     */
    public ParameterValue getParameter(String name) {
        if (parameters == null) {
            return null;
        }
        return parameters.stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    /**
     * 添加或更新参数值
     */
    public void addOrUpdateParameter(ParameterValue parameterValue) {
        if (parameters == null) {
            parameters = new ArrayList<>();
        }

        // 移除旧值
        parameters.removeIf(p -> p.getName().equals(parameterValue.getName()));

        // 添加新值
        parameters.add(parameterValue);
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 验证必填参数
     */
    public boolean validateRequired(List<StepParameter> parameterDefinitions) {
        if (parameterDefinitions == null || parameterDefinitions.isEmpty()) {
            return true;
        }

        for (StepParameter def : parameterDefinitions) {
            if (Boolean.TRUE.equals(def.getRequired())) {
                ParameterValue value = getParameter(def.getName());
                if (value == null || value.getValue() == null) {
                    return false;
                }

                // 检查值是否为空
                Object val = value.getValue();
                if (val instanceof String && ((String) val).isEmpty()) {
                    return false;
                }
                if (val instanceof List && ((List<?>) val).isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 是否已填写任何参数
     */
    public boolean hasAnyParameter() {
        return parameters != null && !parameters.isEmpty();
    }
}
