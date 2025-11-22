package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.OrganizationApplicationService;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.service.DepartmentDomainService;
import com.aquainsight.domain.user.entity.User;
import com.aquainsight.interfaces.rest.dto.DepartmentRequest;
import com.aquainsight.interfaces.rest.vo.DepartmentVO;
import com.aquainsight.interfaces.rest.vo.EmployeeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
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
     *
     * @return 员工列表
     */
    @GetMapping("/employees")
    public Response<List<EmployeeVO>> getAllEmployees() {
        List<User> employees = organizationApplicationService.getAllEmployees();
        List<Department> departments = departmentDomainService.getAllDepartments();
        Map<Integer, String> deptMap = departments.stream()
                .collect(Collectors.toMap(Department::getId, Department::getName));

        List<EmployeeVO> voList = employees.stream()
                .map(user -> convertToEmployeeVO(user, deptMap))
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
    public Response<List<EmployeeVO>> getEmployeesByDepartment(@PathVariable Integer departmentId) {
        List<User> employees = organizationApplicationService.getEmployeesByDepartmentId(departmentId);
        List<Department> departments = departmentDomainService.getAllDepartments();
        Map<Integer, String> deptMap = departments.stream()
                .collect(Collectors.toMap(Department::getId, Department::getName));

        List<EmployeeVO> voList = employees.stream()
                .map(user -> convertToEmployeeVO(user, deptMap))
                .collect(Collectors.toList());
        return Response.success(voList);
    }

    /**
     * 设置员工为负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 更新后的员工
     */
    @PutMapping("/employees/{userId}/set-leader/{departmentId}")
    public Response<EmployeeVO> setLeader(@PathVariable Integer userId, @PathVariable Integer departmentId) {
        try {
            User user = organizationApplicationService.setLeader(userId, departmentId);
            List<Department> departments = departmentDomainService.getAllDepartments();
            Map<Integer, String> deptMap = departments.stream()
                    .collect(Collectors.toMap(Department::getId, Department::getName));
            return Response.success(convertToEmployeeVO(user, deptMap));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新员工部门
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 更新后的员工
     */
    @PutMapping("/employees/{userId}/department/{departmentId}")
    public Response<EmployeeVO> updateEmployeeDepartment(@PathVariable Integer userId, @PathVariable Integer departmentId) {
        try {
            User user = organizationApplicationService.updateEmployeeDepartment(userId, departmentId);
            List<Department> departments = departmentDomainService.getAllDepartments();
            Map<Integer, String> deptMap = departments.stream()
                    .collect(Collectors.toMap(Department::getId, Department::getName));
            return Response.success(convertToEmployeeVO(user, deptMap));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新员工状态
     *
     * @param userId 用户ID
     * @param status 状态
     * @return 更新后的员工
     */
    @PutMapping("/employees/{userId}/status/{status}")
    public Response<EmployeeVO> updateEmployeeStatus(@PathVariable Integer userId, @PathVariable Integer status) {
        try {
            User user = organizationApplicationService.updateEmployeeStatus(userId, status);
            List<Department> departments = departmentDomainService.getAllDepartments();
            Map<Integer, String> deptMap = departments.stream()
                    .collect(Collectors.toMap(Department::getId, Department::getName));
            return Response.success(convertToEmployeeVO(user, deptMap));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 从部门移除员工
     *
     * @param userId 用户ID
     * @return 更新后的员工
     */
    @DeleteMapping("/employees/{userId}/department")
    public Response<EmployeeVO> removeEmployeeFromDepartment(@PathVariable Integer userId) {
        try {
            User user = organizationApplicationService.removeEmployeeFromDepartment(userId);
            List<Department> departments = departmentDomainService.getAllDepartments();
            Map<Integer, String> deptMap = departments.stream()
                    .collect(Collectors.toMap(Department::getId, Department::getName));
            return Response.success(convertToEmployeeVO(user, deptMap));
        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 取消负责人
     *
     * @param userId 用户ID
     * @return 更新后的员工
     */
    @PutMapping("/employees/{userId}/unset-leader")
    public Response<EmployeeVO> unsetLeader(@PathVariable Integer userId) {
        try {
            User user = organizationApplicationService.unsetLeader(userId);
            List<Department> departments = departmentDomainService.getAllDepartments();
            Map<Integer, String> deptMap = departments.stream()
                    .collect(Collectors.toMap(Department::getId, Department::getName));
            return Response.success(convertToEmployeeVO(user, deptMap));
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

    private EmployeeVO convertToEmployeeVO(User user, Map<Integer, String> deptMap) {
        return EmployeeVO.builder()
                .id(user.getId())
                .name(user.getName())
                .gender(user.getGender())
                .departmentId(user.getDepartmentId())
                .departmentName(user.getDepartmentId() != null ? deptMap.get(user.getDepartmentId()) : null)
                .isLeader(user.getIsLeader())
                .status(user.getStatus())
                .phone(user.getPhone())
                .email(user.getEmail())
                .build();
    }
}
