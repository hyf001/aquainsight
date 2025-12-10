package com.aquainsight.domain.maintenance.types;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 步骤参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StepParameter {

    /**
     * 参数名称
     */
    private String name;

    /**
     * 参数类型
     */
    private ParameterType type;

    /**
     * 是否必填
     */
    private Boolean required;
}
