package com.aquainsight.domain.user.service;

import com.aquainsight.domain.user.entity.User;
import com.aquainsight.domain.user.entity.UserDepartment;
import com.aquainsight.domain.user.repository.UserDepartmentRepository;
import com.aquainsight.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 用户-部门关系领域服务
 *
 * @author aquainsight
 */
@Service
@RequiredArgsConstructor
public class UserDepartmentDomainService {

    private final UserDepartmentRepository userDepartmentRepository;
    private final UserRepository userRepository;

    /**
     * 添加用户到部门
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @param isLeader     是否为负责人
     * @return 用户-部门关系
     */
    public UserDepartment addUserToDepartment(Integer userId, Integer departmentId, boolean isLeader) {
        // 验证用户是否存在
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        // 检查关系是否已存在
        Optional<UserDepartment> existingRelation =
                userDepartmentRepository.findByUserIdAndDepartmentId(userId, departmentId);
        if (existingRelation.isPresent()) {
            throw new IllegalArgumentException("用户已在该部门中");
        }

        // 创建关系
        UserDepartment userDepartment = UserDepartment.builder()
                .userId(userId)
                .departmentId(departmentId)
                .isLeader(isLeader ? 1 : 0)
                .createTime(LocalDateTime.now())
                .build();

        return userDepartmentRepository.save(userDepartment);
    }

    /**
     * 从部门移除用户
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 是否移除成功
     */
    public boolean removeUserFromDepartment(Integer userId, Integer departmentId) {
        return userDepartmentRepository.deleteByUserIdAndDepartmentId(userId, departmentId);
    }

    /**
     * 设置用户为部门负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 更新后的关系
     */
    public UserDepartment setUserAsLeader(Integer userId, Integer departmentId) {
        Optional<UserDepartment> relationOpt =
                userDepartmentRepository.findByUserIdAndDepartmentId(userId, departmentId);

        if (!relationOpt.isPresent()) {
            throw new IllegalArgumentException("用户不在该部门中");
        }

        UserDepartment relation = relationOpt.get();
        relation.setAsLeader();
        return userDepartmentRepository.update(relation);
    }

    /**
     * 取消用户的负责人身份
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 更新后的关系
     */
    public UserDepartment unsetUserAsLeader(Integer userId, Integer departmentId) {
        Optional<UserDepartment> relationOpt =
                userDepartmentRepository.findByUserIdAndDepartmentId(userId, departmentId);

        if (!relationOpt.isPresent()) {
            throw new IllegalArgumentException("用户不在该部门中");
        }

        UserDepartment relation = relationOpt.get();
        relation.unsetLeader();
        return userDepartmentRepository.update(relation);
    }

    /**
     * 根据部门ID获取该部门的所有用户
     *
     * @param departmentId 部门ID
     * @return 用户列表
     */
    public List<User> getUsersByDepartmentId(Integer departmentId) {
        List<UserDepartment> relations = userDepartmentRepository.findByDepartmentId(departmentId);

        return relations.stream()
                .map(relation -> userRepository.findById(relation.getUserId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    /**
     * 根据部门ID获取该部门的负责人列表
     *
     * @param departmentId 部门ID
     * @return 负责人列表
     */
    public List<User> getLeadersByDepartmentId(Integer departmentId) {
        List<UserDepartment> leaderRelations =
                userDepartmentRepository.findLeadersByDepartmentId(departmentId);

        return leaderRelations.stream()
                .map(relation -> userRepository.findById(relation.getUserId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    /**
     * 根据用户ID获取该用户所在的所有部门ID
     *
     * @param userId 用户ID
     * @return 部门ID列表
     */
    public List<Integer> getDepartmentIdsByUserId(Integer userId) {
        List<UserDepartment> relations = userDepartmentRepository.findByUserId(userId);

        return relations.stream()
                .map(UserDepartment::getDepartmentId)
                .collect(Collectors.toList());
    }

    /**
     * 判断用户是否在某部门中
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 是否在部门中
     */
    public boolean isUserInDepartment(Integer userId, Integer departmentId) {
        return userDepartmentRepository.findByUserIdAndDepartmentId(userId, departmentId)
                .isPresent();
    }

    /**
     * 判断用户是否为某部门的负责人
     *
     * @param userId       用户ID
     * @param departmentId 部门ID
     * @return 是否为负责人
     */
    public boolean isUserLeaderOfDepartment(Integer userId, Integer departmentId) {
        return userDepartmentRepository.findByUserIdAndDepartmentId(userId, departmentId)
                .map(UserDepartment::isLeader)
                .orElse(false);
    }

    /**
     * 删除用户的所有部门关系
     *
     * @param userId 用户ID
     * @return 删除的数量
     */
    public int removeAllDepartmentsForUser(Integer userId) {
        return userDepartmentRepository.deleteByUserId(userId);
    }

    /**
     * 删除部门的所有用户关系
     *
     * @param departmentId 部门ID
     * @return 删除的数量
     */
    public int removeAllUsersFromDepartment(Integer departmentId) {
        return userDepartmentRepository.deleteByDepartmentId(departmentId);
    }
}
