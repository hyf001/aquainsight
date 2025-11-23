package com.aquainsight.domain.user.repository;

import com.aquainsight.domain.user.entity.UserDepartment;

import java.util.List;
import java.util.Optional;

/**
 * 用户-部门关系仓储接口
 *
 * @author aquainsight
 */
public interface UserDepartmentRepository {

    /**
     * 保存用户-部门关系
     *
     * @param userDepartment 用户-部门关系
     * @return 保存后的关系
     */
    UserDepartment save(UserDepartment userDepartment);

    /**
     * 根据ID查询
     *
     * @param id 主键ID
     * @return 用户-部门关系
     */
    Optional<UserDepartment> findById(Integer id);

    /**
     * 根据用户ID查询所有部门关系
     *
     * @param userId 用户ID
     * @return 部门关系列表
     */
    List<UserDepartment> findByUserId(Integer userId);

    /**
     * 根据部门ID查询所有用户关系
     *
     * @param departmentId 部门ID
     * @return 用户关系列表
     */
    List<UserDepartment> findByDepartmentId(Integer departmentId);

    /**
     * 根据用户ID和部门ID查询关系
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 用户-部门关系
     */
    Optional<UserDepartment> findByUserIdAndDepartmentId(Integer userId, Integer departmentId);

    /**
     * 根据部门ID查询负责人关系
     *
     * @param departmentId 部门ID
     * @return 负责人关系列表
     */
    List<UserDepartment> findLeadersByDepartmentId(Integer departmentId);

    /**
     * 更新用户-部门关系
     *
     * @param userDepartment 用户-部门关系
     * @return 更新后的关系
     */
    UserDepartment update(UserDepartment userDepartment);

    /**
     * 删除用户-部门关系
     *
     * @param id 主键ID
     * @return 是否删除成功
     */
    boolean deleteById(Integer id);

    /**
     * 删除用户在某部门的关系
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 是否删除成功
     */
    boolean deleteByUserIdAndDepartmentId(Integer userId, Integer departmentId);

    /**
     * 删除用户的所有部门关系
     *
     * @param userId 用户ID
     * @return 删除的数量
     */
    int deleteByUserId(Integer userId);

    /**
     * 删除部门的所有用户关系
     *
     * @param departmentId 部门ID
     * @return 删除的数量
     */
    int deleteByDepartmentId(Integer departmentId);
}
