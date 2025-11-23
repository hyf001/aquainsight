package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 设置角色请求DTO
 *
 * @author aquainsight
 */
@Data
public class SetRoleRequest {

    @NotBlank(message = "角色不能为空")
    private String role;
}
