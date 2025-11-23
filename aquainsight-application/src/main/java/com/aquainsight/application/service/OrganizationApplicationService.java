package com.aquainsight.application.service;

import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.service.DepartmentDomainService;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.service.UserDepartmentDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 组织管理应用服务
 *
 * @author aquainsight
 */
@Service
@RequiredArgsConstructor
public class OrganizationApplicationService {

    private final DepartmentDomainService departmentDomainService;
    private final UserDepartmentDomainService userDepartmentDomainService;

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
        return userDepartmentDomainService.getUsersByDepartmentId(departmentId);
    }

    /**
     * 设置员工为负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void setLeader(Integer userId, Integer departmentId) {
        // 先确保用户在该部门中
        if (!userDepartmentDomainService.isUserInDepartment(userId, departmentId)) {
            // 如果用户不在部门中，先添加用户到部门
            userDepartmentDomainService.addUserToDepartment(userId, departmentId, true);
        } else {
            // 如果用户已在部门中，设置为负责人
            userDepartmentDomainService.setUserAsLeader(userId, departmentId);
        }

        // 更新部门的负责人
        departmentDomainService.updateDepartment(departmentId, null, null, null, userId);
    }

    /**
     * 添加员工到部门
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @param isLeader     是否为负责人
     */
    @Transactional(rollbackFor = Exception.class)
    public void addEmployeeToDepartment(Integer userId, Integer departmentId, boolean isLeader) {
        userDepartmentDomainService.addUserToDepartment(userId, departmentId, isLeader);
    }

    /**
     * 从部门移除员工
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 是否移除成功
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean removeEmployeeFromDepartment(Integer userId, Integer departmentId) {
        return userDepartmentDomainService.removeUserFromDepartment(userId, departmentId);
    }

    /**
     * 取消负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void unsetLeader(Integer userId, Integer departmentId) {
        // 取消用户在该部门的负责人身份
        userDepartmentDomainService.unsetUserAsLeader(userId, departmentId);

        // 清除部门的负责人
        departmentDomainService.updateDepartment(departmentId, null, null, null, null);
    }
}
