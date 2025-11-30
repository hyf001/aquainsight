package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 更新方案请求
 */
@Data
public class UpdateSchemeRequest {

    @NotNull(message = "方案ID不能为空")
    private Integer id;

    @NotBlank(message = "方案名称不能为空")
    private String name;
}
