package com.aquainsight.domain.maintenance.types;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 参数选项(用于下拉框、复选框、单选框)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParameterOption {

    /**
     * 选项值
     */
    private String value;

    /**
     * 选项显示文本
     */
    private String label;

    /**
     * 是否默认选中
     */
    private Boolean defaultSelected;

    /**
     * 是否禁用
     */
    private Boolean disabled;
}
