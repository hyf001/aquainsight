package com.aquainsight.domain.user.service;

import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 用户领域服务
 *
 * @author aquainsight
 */
@Service
@RequiredArgsConstructor
public class UserDomainService {

    private final UserRepository userRepository;

    /**
     * 注册新用户
     *
     * @param password 密码
     * @param name     姓名
     * @param phone    手机号
     * @param email    邮箱
     * @param role     角色
     * @return 新用户
     */
    public User registerUser(String password, String name, String phone, String email, String role) {
        // 验证手机号是否已存在
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("手机号不能为空");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("手机号已被注册");
        }

        // 验证邮箱是否已存在
        if (email != null && !email.trim().isEmpty() && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("邮箱已被注册");
        }

        // 创建用户实体
        User user = User.builder()
                .password(password) // TODO: 应该加密存储
                .name(name)
                .phone(phone)
                .email(email)
                .role(role == null ? "user" : role)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        // 保存用户
        return userRepository.save(user);
    }

    /**
     * 用户登录验证
     *
     * @param phone 手机号
     * @param password 密码
     * @return 用户实体
     */
    public User login(String phone, String password) {
        Optional<User> userOpt = userRepository.findByPhone(phone);

        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();

        if (!user.verifyPassword(password)) {
            throw new IllegalArgumentException("密码错误");
        }

        return user;
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
    public User updateUserInfo(Integer userId, String name, String phone, String email, String avatar) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();

        // 如果手机号变更，检查新手机号是否已被使用
        if (phone != null && !phone.trim().isEmpty() && !phone.equals(user.getPhone())) {
            if (userRepository.existsByPhone(phone)) {
                throw new IllegalArgumentException("手机号已被其他用户使用");
            }
        }

        // 如果邮箱变更，检查新邮箱是否已被使用
        if (email != null && !email.trim().isEmpty() && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("邮箱已被其他用户使用");
            }
        }

        // 更新用户信息
        user.updateInfo(name, phone, email, avatar);

        return userRepository.update(user);
    }

    /**
     * 修改密码
     *
     * @param userId      用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 更新后的用户
     */
    public User changePassword(Integer userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = userOpt.get();

        // 验证旧密码
        if (!user.verifyPassword(oldPassword)) {
            throw new IllegalArgumentException("旧密码错误");
        }

        // 设置新密码 (TODO: 应该加密)
        user.setPassword(newPassword);
        user.setUpdateTime(LocalDateTime.now());

        return userRepository.update(user);
    }

    /**
     * 删除用户
     *
     * @param userId 用户ID
     * @return 是否删除成功
     */
    public boolean deleteUser(Integer userId) {
        return userRepository.deleteById(userId);
    }

    /**
     * 根据ID获取用户
     *
     * @param userId 用户ID
     * @return 用户实体
     */
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }
}
