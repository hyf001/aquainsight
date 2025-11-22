package com.aquainsight.domain.organization.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 部门领域实体
 *
 * @author aquainsight
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    /**
     * 部门ID
     */
    private Integer id;

    /**
     * 部门名称
     */
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

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除
     */
    private Integer deleted;

    /**
     * 子部门列表（用于构建树结构）
     */
    private List<Department> children;

    /**
     * 是否为顶级部门
     */
    public boolean isRoot() {
        return parentId == null || parentId == 0;
    }
}
