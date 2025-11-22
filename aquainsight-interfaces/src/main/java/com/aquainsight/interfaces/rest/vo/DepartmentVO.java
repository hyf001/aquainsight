package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 部门VO
 *
 * @author aquainsight
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentVO {

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
     * 子部门列表
     */
    private List<DepartmentVO> children;
}
