package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.OrganizationApplicationService;
import com.aquainsight.application.service.UserApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.service.DepartmentDomainService;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.repository.UserRepository;
import com.aquainsight.domain.user.service.UserDepartmentDomainService;
import com.aquainsight.interfaces.rest.dto.DepartmentRequest;
import com.aquainsight.interfaces.rest.vo.DepartmentVO;
import com.aquainsight.interfaces.rest.vo.UserInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 组织管理控制器
 *
 * @author aquainsight
 */
@RestController
@RequestMapping("/api/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationApplicationService organizationApplicationService;
    private final DepartmentDomainService departmentDomainService;
    private final UserRepository userRepository;
    private final UserApplicationService userApplicationService;
    private final UserDepartmentDomainService userDepartmentDomainService;

    /**
     * 获取部门树
     *
     * @return 部门树
     */
    @GetMapping("/departments/tree")
    public Response<List<DepartmentVO>> getDepartmentTree() {
        List<Department> tree = organizationApplicationService.getDepartmentTree();
        List<DepartmentVO> voList = convertToDepartmentVOList(tree);
        return Response.success(voList);
    }

    /**
     * 获取所有部门列表
     *
     * @return 部门列表
     */
    @GetMapping("/departments")
    public Response<List<DepartmentVO>> getAllDepartments() {
        List<Department> departments = departmentDomainService.getAllDepartments();
        List<DepartmentVO> voList = departments.stream()
                .map(this::convertToDepartmentVO)
                .collect(Collectors.toList());
        return Response.success(voList);
    }

    /**
     * 创建部门
     *
     * @param request 部门请求
     * @return 新部门
     */
    @PostMapping("/departments")
    public Response<DepartmentVO> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        try {
            Department department = organizationApplicationService.createDepartment(
                    request.getName(),
                    request.getParentId(),
                    request.getSort()
            );
            return Response.success(convertToDepartmentVO(department));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新部门
     *
     * @param id      部门ID
     * @param request 部门请求
     * @return 更新后的部门
     */
    @PutMapping("/departments/{id}")
    public Response<DepartmentVO> updateDepartment(@PathVariable Integer id, @Valid @RequestBody DepartmentRequest request) {
        try {
            Department department = organizationApplicationService.updateDepartment(
                    id,
                    request.getName(),
                    request.getParentId(),
                    request.getSort(),
                    request.getLeaderId()
            );
            return Response.success(convertToDepartmentVO(department));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除部门
     *
     * @param id 部门ID
     * @return 是否删除成功
     */
    @DeleteMapping("/departments/{id}")
    public Response<Void> deleteDepartment(@PathVariable Integer id) {
        try {
            organizationApplicationService.deleteDepartment(id);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有员工
     * 注意：此接口为兼容前端保留，返回所有用户的基本信息
     *
     * @return 员工列表
     */
    @GetMapping("/employees")
    public Response<List<UserInfoVO>> getAllEmployees() {
        List<User> employees = userRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<UserInfoVO> voList = employees.stream()
                .map(user -> UserInfoVO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .gender(user.getGender())
                        .phone(user.getPhone())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .createTime(user.getCreateTime() != null ? user.getCreateTime().format(formatter) : null)
                        .build())
                .collect(Collectors.toList());
        return Response.success(voList);
    }

    /**
     * 根据部门ID获取员工列表
     *
     * @param departmentId 部门ID
     * @return 员工列表
     */
    @GetMapping("/employees/department/{departmentId}")
    public Response<List<UserInfoVO>> getEmployeesByDepartment(@PathVariable Integer departmentId) {
        List<User> employees = organizationApplicationService.getEmployeesByDepartmentId(departmentId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<UserInfoVO> voList = employees.stream()
                .map(user -> {
                    // 查询用户在该部门是否为负责人
                    boolean isLeader = userDepartmentDomainService.isUserLeaderOfDepartment(user.getId(), departmentId);
                    return UserInfoVO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .gender(user.getGender())
                        .phone(user.getPhone())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .createTime(user.getCreateTime() != null ? user.getCreateTime().format(formatter) : null)
                        .isLeader(isLeader ? 1 : 0)
                        .build();
                })
                .collect(Collectors.toList());
        return Response.success(voList);
    }

    /**
     * 设置员工为负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 成功响应
     */
    @PutMapping("/employees/{userId}/set-leader/{departmentId}")
    public Response<Void> setLeader(@PathVariable Integer userId, @PathVariable Integer departmentId) {
        try {
            organizationApplicationService.setLeader(userId, departmentId);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 添加员工到部门（POST方式）
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @param isLeader     是否为负责人（可选）
     * @return 成功响应
     */
    @PostMapping("/employees/{userId}/department/{departmentId}")
    public Response<Void> addEmployeeToDepartment(
            @PathVariable Integer userId,
            @PathVariable Integer departmentId,
            @RequestParam(defaultValue = "false") boolean isLeader) {
        try {
            organizationApplicationService.addEmployeeToDepartment(userId, departmentId, isLeader);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新员工部门（PUT方式，兼容前端）
     * 实际上是添加用户到部门
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 成功响应
     */
    @PutMapping("/employees/{userId}/department/{departmentId}")
    public Response<Void> updateEmployeeDepartment(
            @PathVariable Integer userId,
            @PathVariable Integer departmentId) {
        try {
            organizationApplicationService.addEmployeeToDepartment(userId, departmentId, false);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新员工状态
     *
     * @param userId 用户ID
     * @param status 状态
     * @return 成功响应
     */
    @PutMapping("/employees/{userId}/status/{status}")
    public Response<Void> updateEmployeeStatus(@PathVariable Integer userId, @PathVariable Integer status) {
        try {
            userApplicationService.updateUserStatus(userId, status);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 从部门移除员工（兼容前端，只需userId）
     * 注意：由于现在是多对多关系，此方法会移除用户的所有部门关系
     *
     * @param userId 用户ID
     * @return 成功响应
     */
    @DeleteMapping("/employees/{userId}/department")
    public Response<Void> removeEmployeeFromAllDepartments(@PathVariable Integer userId) {
        // 暂时不实现，提示前端使用新的API
        return Response.error("请使用 DELETE /employees/{userId}/department/{departmentId} 指定部门ID");
    }

    /**
     * 从部门移除员工
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 成功响应
     */
    @DeleteMapping("/employees/{userId}/department/{departmentId}")
    public Response<Void> removeEmployeeFromDepartment(@PathVariable Integer userId, @PathVariable Integer departmentId) {
        try {
            organizationApplicationService.removeEmployeeFromDepartment(userId, departmentId);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 取消负责人（兼容前端，不需要departmentId）
     * 注意：由于现在是多对多关系，建议使用新的API指定部门ID
     *
     * @param userId 用户ID
     * @return 成功响应
     */
    @PutMapping("/employees/{userId}/unset-leader")
    public Response<Void> unsetLeaderOld(@PathVariable Integer userId) {
        // 暂时不实现，提示前端使用新的API
        return Response.error("请使用 PUT /employees/{userId}/unset-leader/{departmentId} 指定部门ID");
    }

    /**
     * 取消负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 成功响应
     */
    @PutMapping("/employees/{userId}/unset-leader/{departmentId}")
    public Response<Void> unsetLeader(@PathVariable Integer userId, @PathVariable Integer departmentId) {
        try {
            organizationApplicationService.unsetLeader(userId, departmentId);
            return Response.success();
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    private DepartmentVO convertToDepartmentVO(Department department) {
        return DepartmentVO.builder()
                .id(department.getId())
                .name(department.getName())
                .parentId(department.getParentId())
                .sort(department.getSort())
                .leaderId(department.getLeaderId())
                .build();
    }

    private List<DepartmentVO> convertToDepartmentVOList(List<Department> departments) {
        return departments.stream()
                .map(dept -> {
                    DepartmentVO vo = convertToDepartmentVO(dept);
                    if (dept.getChildren() != null && !dept.getChildren().isEmpty()) {
                        vo.setChildren(convertToDepartmentVOList(dept.getChildren()));
                    }
                    return vo;
                })
                .collect(Collectors.toList());
    }

    // 注意：convertToEmployeeVO方法已移除
    // 由于用户-部门关系现在是多对多，单个用户可能属于多个部门
    // 请使用专门的API获取用户的部门信息
}
