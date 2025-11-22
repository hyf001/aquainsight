package com.aquainsight.interfaces.rest.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 部门请求DTO
 *
 * @author aquainsight
 */
@Data
public class DepartmentRequest {

    /**
     * 部门名称
     */
    @NotBlank(message = "部门名称不能为空")
    private String name;

    /**
     * 父部门ID
     */
    private Integer parentId;

    /**
     * 排序号
     */
    private Integer sort;

    /**
     * 负责人ID
     */
    private Integer leaderId;
}
