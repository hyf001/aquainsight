package com.aquainsight.application.service;

import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.service.UserDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 用户应用服务
 *
 * @author aquainsight
 */
@Service
@RequiredArgsConstructor
public class UserApplicationService {

    private final UserDomainService userDomainService;

    /**
     * 用户注册
     *
     * @param password 密码
     * @param name     姓名
     * @param phone    手机号
     * @param email    邮箱
     * @param role     角色
     * @return 新用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User register(String password, String name, String phone, String email, String role) {
        return userDomainService.registerUser(password, name, phone, email, role);
    }

    /**
     * 用户登录
     *
     * @param phone 手机号
     * @param password 密码
     * @return 用户实体
     */
    public User login(String phone, String password) {
        return userDomainService.login(phone, password);
    }

    /**
     * 更新用户信息
     *
     * @param userId 用户ID
     * @param name   姓名
     * @param phone  手机号
     * @param email  邮箱
     * @param avatar 头像
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User updateUserInfo(Integer userId, String name, String phone, String email, String avatar) {
        return userDomainService.updateUserInfo(userId, name, phone, email, avatar);
    }

    /**
     * 修改密码
     *
     * @param userId      用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 更新后的用户
     */
    @Transactional(rollbackFor = Exception.class)
    public User changePassword(Integer userId, String oldPassword, String newPassword) {
        return userDomainService.changePassword(userId, oldPassword, newPassword);
    }

    /**
     * 删除用户
     *
     * @param userId 用户ID
     * @return 是否删除成功
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteUser(Integer userId) {
        return userDomainService.deleteUser(userId);
    }

    /**
     * 根据ID获取用户
     *
     * @param userId 用户ID
     * @return 用户实体
     */
    public Optional<User> getUserById(Integer userId) {
        return userDomainService.getUserById(userId);
    }

}
