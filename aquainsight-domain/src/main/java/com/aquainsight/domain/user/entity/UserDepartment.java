package com.aquainsight.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户-部门关系实体
 *
 * @author aquainsight
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDepartment {

    /**
     * 主键ID
     */
    private Integer id;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 部门ID
     */
    private Integer departmentId;

    /**
     * 是否负责人 (0-否, 1-是)
     */
    private Integer isLeader;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 设置为负责人
     */
    public void setAsLeader() {
        this.isLeader = 1;
    }

    /**
     * 取消负责人
     */
    public void unsetLeader() {
        this.isLeader = 0;
    }

    /**
     * 判断是否为负责人
     *
     * @return 是否为负责人
     */
    public boolean isLeader() {
        return this.isLeader != null && this.isLeader == 1;
    }
}
