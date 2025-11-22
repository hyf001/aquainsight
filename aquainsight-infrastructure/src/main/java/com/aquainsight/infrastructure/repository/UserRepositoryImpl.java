package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.repository.UserRepository;
import com.aquainsight.infrastructure.converter.UserConverter;
import com.aquainsight.infrastructure.db.dao.UserDao;
import com.aquainsight.infrastructure.db.model.UserPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用户仓储实现
 *
 * @author aquainsight
 */
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserDao userDao;

    @Override
    public User save(User user) {
        UserPO userPO = UserConverter.INSTANCE.toPO(user);
        userDao.insert(userPO);
        return UserConverter.INSTANCE.toEntity(userPO);
    }

    @Override
    public Optional<User> findById(Integer id) {
        UserPO userPO = userDao.selectById(id);
        return Optional.ofNullable(userPO)
                .map(UserConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<User> findByPhone(String phone) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getPhone, phone);
        UserPO userPO = userDao.selectOne(wrapper);
        return Optional.ofNullable(userPO)
                .map(UserConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getEmail, email);
        UserPO userPO = userDao.selectOne(wrapper);
        return Optional.ofNullable(userPO)
                .map(UserConverter.INSTANCE::toEntity);
    }

    @Override
    public List<User> findAll() {
        List<UserPO> userPOList = userDao.selectList(null);
        return UserConverter.INSTANCE.toEntityList(userPOList);
    }

    @Override
    public List<User> findByRole(String role) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getRole, role);
        List<UserPO> userPOList = userDao.selectList(wrapper);
        return UserConverter.INSTANCE.toEntityList(userPOList);
    }

    @Override
    public User update(User user) {
        UserPO userPO = UserConverter.INSTANCE.toPO(user);
        userDao.updateById(userPO);
        return UserConverter.INSTANCE.toEntity(userPO);
    }

    @Override
    public boolean deleteById(Integer id) {
        int rows = userDao.deleteById(id);
        return rows > 0;
    }

    @Override
    public boolean existsByPhone(String phone) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getPhone, phone);
        return userDao.selectCount(wrapper) > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getEmail, email);
        return userDao.selectCount(wrapper) > 0;
    }
}
