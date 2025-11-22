package com.aquainsight.application.service;

import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.service.DepartmentDomainService;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 组织管理应用服务
 *
 * @author aquainsight
 */
@Service
@RequiredArgsConstructor
public class OrganizationApplicationService {

    private final DepartmentDomainService departmentDomainService;
    private final UserRepository userRepository;

    /**
     * 获取部门树
     *
     * @return 部门树
     */
    public List<Department> getDepartmentTree() {
        return departmentDomainService.getDepartmentTree();
    }

    /**
     * 创建部门
     *
     * @param name     部门名称
     * @param parentId 父部门ID
     * @param sort     排序号
     * @return 新部门
     */
    @Transactional(rollbackFor = Exception.class)
    public Department createDepartment(String name, Integer parentId, Integer sort) {
        return departmentDomainService.createDepartment(name, parentId, sort);
    }

    /**
     * 更新部门
     *
     * @param id       部门ID
     * @param name     部门名称
     * @param parentId 父部门ID
     * @param sort     排序号
     * @param leaderId 负责人ID
     * @return 更新后的部门
     */
    @Transactional(rollbackFor = Exception.class)
    public Department updateDepartment(Integer id, String name, Integer parentId, Integer sort, Integer leaderId) {
        return departmentDomainService.updateDepartment(id, name, parentId, sort, leaderId);
    }

    /**
     * 删除部门
     *
     * @param id 部门ID
     * @return 是否删除成功
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteDepartment(Integer id) {
        return departmentDomainService.deleteDepartment(id);
    }

    /**
     * 根据部门ID获取员工列表
     *
     * @param departmentId 部门ID
     * @return 员工列表
     */
    public List<User> getEmployeesByDepartmentId(Integer departmentId) {
        return userRepository.findAll().stream()
                .filter(user -> departmentId.equals(user.getDepartmentId()))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 获取所有员工
     *
     * @return 员工列表
     */
    public List<User> getAllEmployees() {
        return userRepository.findAll();
    }

    /**
     * 设置员工为负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User setLeader(Integer userId, Integer departmentId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();
        user.setIsLeader(1);
        user.setDepartmentId(departmentId);
        userRepository.update(user);

        // 更新部门的负责人
        departmentDomainService.updateDepartment(departmentId, null, null, null, userId);

        return user;
    }

    /**
     * 更新员工部门
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User updateEmployeeDepartment(Integer userId, Integer departmentId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();
        user.setDepartmentId(departmentId);
        return userRepository.update(user);
    }

    /**
     * 更新员工状态
     *
     * @param userId 用户ID
     * @param status 状态
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User updateEmployeeStatus(Integer userId, Integer status) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();
        user.setStatus(status);
        return userRepository.update(user);
    }

    /**
     * 从部门移除员工
     *
     * @param userId 用户ID
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User removeEmployeeFromDepartment(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();
        user.setDepartmentId(null);
        user.setIsLeader(0);  // 移除部门时同时取消负责人身份
        return userRepository.update(user);
    }

    /**
     * 取消负责人
     *
     * @param userId 用户ID
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User unsetLeader(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();
        user.setIsLeader(0);
        userRepository.update(user);

        // 如果有部门，清除部门的负责人
        if (user.getDepartmentId() != null) {
            departmentDomainService.updateDepartment(user.getDepartmentId(), null, null, null, null);
        }

        return user;
    }
}
