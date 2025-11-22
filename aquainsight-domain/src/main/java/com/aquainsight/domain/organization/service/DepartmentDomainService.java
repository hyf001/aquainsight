package com.aquainsight.domain.organization.service;

import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 部门领域服务
 *
 * @author aquainsight
 */
@Service
@RequiredArgsConstructor
public class DepartmentDomainService {

    private final DepartmentRepository departmentRepository;

    /**
     * 创建部门
     *
     * @param name     部门名称
     * @param parentId 父部门ID
     * @param sort     排序号
     * @return 新部门
     */
    public Department createDepartment(String name, Integer parentId, Integer sort) {
        // 验证部门名称是否已存在
        if (departmentRepository.existsByNameAndParentId(name, parentId)) {
            throw new IllegalArgumentException("同级部门下已存在相同名称");
        }

        Department department = Department.builder()
                .name(name)
                .parentId(parentId == null ? 0 : parentId)
                .sort(sort == null ? 0 : sort)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return departmentRepository.save(department);
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
    public Department updateDepartment(Integer id, String name, Integer parentId, Integer sort, Integer leaderId) {
        Optional<Department> deptOpt = departmentRepository.findById(id);
        if (!deptOpt.isPresent()) {
            throw new IllegalArgumentException("部门不存在");
        }

        Department department = deptOpt.get();

        if (name != null && !name.equals(department.getName())) {
            Integer targetParentId = parentId != null ? parentId : department.getParentId();
            if (departmentRepository.existsByNameAndParentId(name, targetParentId)) {
                throw new IllegalArgumentException("同级部门下已存在相同名称");
            }
            department.setName(name);
        }

        if (parentId != null) {
            department.setParentId(parentId);
        }
        if (sort != null) {
            department.setSort(sort);
        }
        if (leaderId != null) {
            department.setLeaderId(leaderId);
        }
        department.setUpdateTime(LocalDateTime.now());

        return departmentRepository.update(department);
    }

    /**
     * 删除部门
     *
     * @param id 部门ID
     * @return 是否删除成功
     */
    public boolean deleteDepartment(Integer id) {
        // 检查是否有子部门
        List<Department> children = departmentRepository.findByParentId(id);
        if (!children.isEmpty()) {
            throw new IllegalArgumentException("该部门下存在子部门，无法删除");
        }

        return departmentRepository.deleteById(id);
    }

    /**
     * 获取部门树
     *
     * @return 部门树
     */
    public List<Department> getDepartmentTree() {
        List<Department> allDepartments = departmentRepository.findAll();
        return buildTree(allDepartments);
    }

    /**
     * 构建部门树
     *
     * @param departments 部门列表
     * @return 树形结构
     */
    private List<Department> buildTree(List<Department> departments) {
        Map<Integer, List<Department>> parentMap = departments.stream()
                .collect(Collectors.groupingBy(Department::getParentId));

        List<Department> roots = parentMap.getOrDefault(0, new ArrayList<>());

        for (Department root : roots) {
            buildChildren(root, parentMap);
        }

        return roots;
    }

    /**
     * 递归构建子节点
     */
    private void buildChildren(Department parent, Map<Integer, List<Department>> parentMap) {
        List<Department> children = parentMap.getOrDefault(parent.getId(), new ArrayList<>());
        parent.setChildren(children);
        for (Department child : children) {
            buildChildren(child, parentMap);
        }
    }

    /**
     * 根据ID获取部门
     *
     * @param id 部门ID
     * @return 部门实体
     */
    public Optional<Department> getDepartmentById(Integer id) {
        return departmentRepository.findById(id);
    }

    /**
     * 获取所有部门
     *
     * @return 部门列表
     */
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
