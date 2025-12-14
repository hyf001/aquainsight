package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
 * 参数选项DTO(用于下拉框、复选框、单选框)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParameterOptionDTO {

    /**
     * 选项值
     */
    @NotBlank(message = "选项值不能为空")
    private String value;

    /**
     * 选项显示文本
     */
    @NotBlank(message = "选项显示文本不能为空")
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
