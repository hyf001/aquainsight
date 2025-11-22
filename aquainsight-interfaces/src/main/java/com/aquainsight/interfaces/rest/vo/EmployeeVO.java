package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 员工VO
 *
 * @author aquainsight
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeVO {

    /**
     * 用户ID
     */
    private Integer id;

    /**
     * 姓名
     */
    private String name;

    /**
     * 性别
     */
    private String gender;

    /**
     * 所属部门ID
     */
    private Integer departmentId;

    /**
     * 部门名称
     */
    private String departmentName;

    /**
     * 是否负责人
     */
    private Integer isLeader;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;
}
