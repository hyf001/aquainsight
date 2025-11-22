package com.aquainsight.domain.organization.repository;

import com.aquainsight.domain.organization.entity.Department;

import java.util.List;
import java.util.Optional;

/**
 * 部门仓储接口
 *
 * @author aquainsight
 */
public interface DepartmentRepository {

    /**
     * 保存部门
     *
     * @param department 部门实体
     * @return 保存后的部门
     */
    Department save(Department department);

    /**
     * 根据ID查询部门
     *
     * @param id 部门ID
     * @return 部门实体
     */
    Optional<Department> findById(Integer id);

    /**
     * 查询所有部门
     *
     * @return 部门列表
     */
    List<Department> findAll();

    /**
     * 根据父ID查询子部门
     *
     * @param parentId 父部门ID
     * @return 子部门列表
     */
    List<Department> findByParentId(Integer parentId);

    /**
     * 更新部门
     *
     * @param department 部门实体
     * @return 更新后的部门
     */
    Department update(Department department);

    /**
     * 删除部门（逻辑删除）
     *
     * @param id 部门ID
     * @return 是否删除成功
     */
    boolean deleteById(Integer id);

    /**
     * 检查部门名称是否存在
     *
     * @param name 部门名称
     * @param parentId 父部门ID
     * @return 是否存在
     */
    boolean existsByNameAndParentId(String name, Integer parentId);
}
