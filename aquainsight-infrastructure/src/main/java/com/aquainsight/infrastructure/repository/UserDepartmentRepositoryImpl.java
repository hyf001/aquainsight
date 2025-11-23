package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.user.entity.UserDepartment;
import com.aquainsight.domain.user.repository.UserDepartmentRepository;
import com.aquainsight.infrastructure.converter.UserDepartmentConverter;
import com.aquainsight.infrastructure.db.dao.UserDepartmentDao;
import com.aquainsight.infrastructure.db.model.UserDepartmentPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用户-部门关系仓储实现
 *
 * @author aquainsight
 */
@Repository
@RequiredArgsConstructor
public class UserDepartmentRepositoryImpl implements UserDepartmentRepository {

    private final UserDepartmentDao userDepartmentDao;

    @Override
    public UserDepartment save(UserDepartment userDepartment) {
        UserDepartmentPO po = UserDepartmentConverter.INSTANCE.toPO(userDepartment);
        userDepartmentDao.insert(po);
        return UserDepartmentConverter.INSTANCE.toEntity(po);
    }

    @Override
    public Optional<UserDepartment> findById(Integer id) {
        UserDepartmentPO po = userDepartmentDao.selectById(id);
        return Optional.ofNullable(po)
                .map(UserDepartmentConverter.INSTANCE::toEntity);
    }

    @Override
    public List<UserDepartment> findByUserId(Integer userId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getUserId, userId);
        List<UserDepartmentPO> poList = userDepartmentDao.selectList(wrapper);
        return UserDepartmentConverter.INSTANCE.toEntityList(poList);
    }

    @Override
    public List<UserDepartment> findByDepartmentId(Integer departmentId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getDepartmentId, departmentId);
        List<UserDepartmentPO> poList = userDepartmentDao.selectList(wrapper);
        return UserDepartmentConverter.INSTANCE.toEntityList(poList);
    }

    @Override
    public Optional<UserDepartment> findByUserIdAndDepartmentId(Integer userId, Integer departmentId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getUserId, userId)
                .eq(UserDepartmentPO::getDepartmentId, departmentId);
        UserDepartmentPO po = userDepartmentDao.selectOne(wrapper);
        return Optional.ofNullable(po)
                .map(UserDepartmentConverter.INSTANCE::toEntity);
    }

    @Override
    public List<UserDepartment> findLeadersByDepartmentId(Integer departmentId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getDepartmentId, departmentId)
                .eq(UserDepartmentPO::getIsLeader, 1);
        List<UserDepartmentPO> poList = userDepartmentDao.selectList(wrapper);
        return UserDepartmentConverter.INSTANCE.toEntityList(poList);
    }

    @Override
    public UserDepartment update(UserDepartment userDepartment) {
        UserDepartmentPO po = UserDepartmentConverter.INSTANCE.toPO(userDepartment);
        userDepartmentDao.updateById(po);
        return UserDepartmentConverter.INSTANCE.toEntity(po);
    }

    @Override
    public boolean deleteById(Integer id) {
        int rows = userDepartmentDao.deleteById(id);
        return rows > 0;
    }

    @Override
    public boolean deleteByUserIdAndDepartmentId(Integer userId, Integer departmentId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getUserId, userId)
                .eq(UserDepartmentPO::getDepartmentId, departmentId);
        int rows = userDepartmentDao.delete(wrapper);
        return rows > 0;
    }

    @Override
    public int deleteByUserId(Integer userId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getUserId, userId);
        return userDepartmentDao.delete(wrapper);
    }

    @Override
    public int deleteByDepartmentId(Integer departmentId) {
        LambdaQueryWrapper<UserDepartmentPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDepartmentPO::getDepartmentId, departmentId);
        return userDepartmentDao.delete(wrapper);
    }
}
