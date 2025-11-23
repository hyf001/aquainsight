package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

/**
 * 更新用户请求DTO
 *
 * @author aquainsight
 */
@Data
public class UpdateUserRequest {

    private String name;

    private String gender;

    private String phone;

    private String email;

    private String avatar;
}
