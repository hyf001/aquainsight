package com.aquainsight.domain.user.repository;

import com.aquainsight.domain.user.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * 用户仓储接口
 *
 * @author aquainsight
 */
public interface UserRepository {

    /**
     * 保存用户
     *
     * @param user 用户实体
     * @return 保存后的用户
     */
    User save(User user);

    /**
     * 根据ID查询用户
     *
     * @param id 用户ID
     * @return 用户实体
     */
    Optional<User> findById(Integer id);

    /**
     * 根据手机号查询用户
     *
     * @param phone 手机号
     * @return 用户实体
     */
    Optional<User> findByPhone(String phone);

    /**
     * 根据邮箱查询用户
     *
     * @param email 邮箱
     * @return 用户实体
     */
    Optional<User> findByEmail(String email);

    /**
     * 查询所有用户
     *
     * @return 用户列表
     */
    List<User> findAll();

    /**
     * 根据角色查询用户列表
     *
     * @param role 角色
     * @return 用户列表
     */
    List<User> findByRole(String role);

    /**
     * 更新用户
     *
     * @param user 用户实体
     * @return 更新后的用户
     */
    User update(User user);

    /**
     * 删除用户（逻辑删除）
     *
     * @param id 用户ID
     * @return 是否删除成功
     */
    boolean deleteById(Integer id);

    /**
     * 检查手机号是否存在
     *
     * @param phone 手机号
     * @return 是否存在
     */
    boolean existsByPhone(String phone);

    /**
     * 检查邮箱是否存在
     *
     * @param email 邮箱
     * @return 是否存在
     */
    boolean existsByEmail(String email);
}
