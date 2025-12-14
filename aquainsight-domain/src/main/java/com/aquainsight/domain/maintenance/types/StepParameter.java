package com.aquainsight.domain.maintenance.types;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
     * 参数标签(显示文本)
     */
    private String label;

    /**
     * 参数类型
     */
    private ParameterType type;

    /**
     * 是否必填
     */
    private Boolean required;

    /**
     * 占位符文本(用于文本输入框)
     */
    private String placeholder;

    /**
     * 选项列表(用于下拉框、复选框、单选框)
     */
    private List<ParameterOption> options;

    /**
     * 默认值
     */
    private String defaultValue;

    /**
     * 最大长度(用于文本输入)
     */
    private Integer maxLength;

    /**
     * 最小长度(用于文本输入)
     */
    private Integer minLength;

    /**
     * 最大选择数量(用于复选框)
     */
    private Integer maxSelect;

    /**
     * 最小选择数量(用于复选框)
     */
    private Integer minSelect;

    /**
     * 提示信息
     */
    private String hint;
}
