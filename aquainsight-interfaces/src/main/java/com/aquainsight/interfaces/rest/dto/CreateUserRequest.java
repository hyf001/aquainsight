package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 创建用户请求DTO
 *
 * @author aquainsight
 */
@Data
public class CreateUserRequest {

    @NotBlank(message = "姓名不能为空")
    private String name;

    @NotBlank(message = "密码不能为空")
    private String password;

    private String gender;

    @NotBlank(message = "手机号不能为空")
    private String phone;

    private String email;

    private String role;
}
