package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.organization.entity.Department;
import com.aquainsight.domain.organization.repository.DepartmentRepository;
import com.aquainsight.infrastructure.converter.DepartmentConverter;
import com.aquainsight.infrastructure.db.dao.DepartmentDao;
import com.aquainsight.infrastructure.db.model.DepartmentPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 部门仓储实现
 *
 * @author aquainsight
 */
@Repository
@RequiredArgsConstructor
public class DepartmentRepositoryImpl implements DepartmentRepository {

    private final DepartmentDao departmentDao;

    @Override
    public Department save(Department department) {
        DepartmentPO departmentPO = DepartmentConverter.INSTANCE.toPO(department);
        departmentDao.insert(departmentPO);
        return DepartmentConverter.INSTANCE.toEntity(departmentPO);
    }

    @Override
    public Optional<Department> findById(Integer id) {
        DepartmentPO departmentPO = departmentDao.selectById(id);
        return Optional.ofNullable(departmentPO)
                .map(DepartmentConverter.INSTANCE::toEntity);
    }

    @Override
    public List<Department> findAll() {
        LambdaQueryWrapper<DepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(DepartmentPO::getSort);
        List<DepartmentPO> departmentPOList = departmentDao.selectList(wrapper);
        return DepartmentConverter.INSTANCE.toEntityList(departmentPOList);
    }

    @Override
    public List<Department> findByParentId(Integer parentId) {
        LambdaQueryWrapper<DepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DepartmentPO::getParentId, parentId)
                .orderByAsc(DepartmentPO::getSort);
        List<DepartmentPO> departmentPOList = departmentDao.selectList(wrapper);
        return DepartmentConverter.INSTANCE.toEntityList(departmentPOList);
    }

    @Override
    public Department update(Department department) {
        DepartmentPO departmentPO = DepartmentConverter.INSTANCE.toPO(department);
        departmentDao.updateById(departmentPO);
        return DepartmentConverter.INSTANCE.toEntity(departmentPO);
    }

    @Override
    public boolean deleteById(Integer id) {
        int rows = departmentDao.deleteById(id);
        return rows > 0;
    }

    @Override
    public boolean existsByNameAndParentId(String name, Integer parentId) {
        LambdaQueryWrapper<DepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DepartmentPO::getName, name)
                .eq(DepartmentPO::getParentId, parentId);
        return departmentDao.selectCount(wrapper) > 0;
    }
}
