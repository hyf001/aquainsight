package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 作业参数DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobParameterDTO {

    /**
     * 参数名称
     */
    @NotBlank(message = "参数名称不能为空")
    private String name;

    /**
     * 参数标签(显示文本)
     */
    private String label;

    /**
     * 参数类型：TEXT, IMAGE, SELECT, CHECKBOX, RADIO
     */
    @NotBlank(message = "参数类型不能为空")
    private String type;

    /**
     * 是否必填
     */
    @NotNull(message = "是否必填不能为空")
    private Boolean required;

    /**
     * 占位符文本(用于文本输入框)
     */
    private String placeholder;

    /**
     * 选项列表(用于下拉框、复选框、单选框)
     */
    private List<ParameterOptionDTO> options;

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
