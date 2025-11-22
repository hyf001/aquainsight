package com.aquainsight.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户领域实体
 *
 * @author aquainsight
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * 用户ID
     */
    private Integer id;

    /**
     * 密码
     */
    private String password;

    /**
     * 姓名
     */
    private String name;

    /**
     * 性别
     */
    private String gender;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 角色
     */
    private String role;

    /**
     * 所属部门ID
     */
    private Integer departmentId;

    /**
     * 是否负责人
     */
    private Integer isLeader;

    /**
     * 状态 (0-禁用, 1-启用)
     */
    private Integer status;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除 (0-未删除, 1-已删除)
     */
    private Integer deleted;

    /**
     * 验证密码
     *
     * @param rawPassword 原始密码
     * @return 是否匹配
     */
    public boolean verifyPassword(String rawPassword) {
        // TODO: 实现密码加密验证逻辑
        return this.password != null && this.password.equals(rawPassword);
    }

    /**
     * 是否为管理员
     *
     * @return 是否为管理员
     */
    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(this.role);
    }

    /**
     * 更新用户信息
     *
     * @param name   姓名
     * @param phone  手机号
     * @param email  邮箱
     * @param avatar 头像
     */
    public void updateInfo(String name, String phone, String email, String avatar) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
        if (phone != null && !phone.trim().isEmpty()) {
            this.phone = phone;
        }
        if (email != null && !email.trim().isEmpty()) {
            this.email = email;
        }
        if (avatar != null && !avatar.trim().isEmpty()) {
            this.avatar = avatar;
        }
        this.updateTime = LocalDateTime.now();
    }
}
