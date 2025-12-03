package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
     * 参数类型：TEXT, IMAGE, TEXT_LIST, IMAGE_LIST
     */
    @NotBlank(message = "参数类型不能为空")
    private String type;

    /**
     * 是否必填
     */
    @NotNull(message = "是否必填不能为空")
    private Boolean required;
}
