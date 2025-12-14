package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.Task;
import com.aquainsight.domain.maintenance.repository.TaskRepository;
import com.aquainsight.domain.maintenance.types.TaskStatus;
import com.aquainsight.infrastructure.converter.TaskConverter;
import com.aquainsight.infrastructure.db.dao.TaskDao;
import com.aquainsight.infrastructure.db.model.TaskPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务仓储实现
 */
@Repository
@RequiredArgsConstructor
public class TaskRepositoryImpl implements TaskRepository {

    private final TaskDao taskDao;

    @Override
    public Task save(Task task) {
        TaskPO taskPO = TaskConverter.INSTANCE.toPO(task);
        if (task.getId() == null) {
            taskDao.insert(taskPO);
        } else {
            taskDao.updateById(taskPO);
        }
        return TaskConverter.INSTANCE.toEntity(taskPO);
    }

    @Override
    public Task findById(Integer id) {
        // 使用selectByIdWithDetails方法，包含步骤、站点、任务模版等关联信息
        TaskPO taskPO = taskDao.selectByIdWithDetails(id);
        if (taskPO == null) {
            return null;
        }
        return TaskConverter.INSTANCE.toEntity(taskPO);
    }

    @Override
    public List<Task> findByTaskSchedulerId(Integer taskSchedulerId) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskPO::getTaskSchedulerId, taskSchedulerId);
        wrapper.orderByDesc(TaskPO::getTriggerTime);
        List<TaskPO> taskPOList = taskDao.selectList(wrapper);
        return TaskConverter.INSTANCE.toEntityList(taskPOList);
    }

    @Override
    public List<Task> findByStatus(TaskStatus status) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskPO::getStatus, status.name());
        wrapper.orderByDesc(TaskPO::getTriggerTime);
        List<TaskPO> taskPOList = taskDao.selectList(wrapper);
        return TaskConverter.INSTANCE.toEntityList(taskPOList);
    }

    @Override
    public List<Task> findByOperator(String operator) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskPO::getOperator, operator);
        wrapper.orderByDesc(TaskPO::getTriggerTime);
        List<TaskPO> taskPOList = taskDao.selectList(wrapper);
        return TaskConverter.INSTANCE.toEntityList(taskPOList);
    }

    @Override
    public List<Task> findInstancesToCheckOverdue(LocalDateTime currentTime) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.le(TaskPO::getExpiredTime, currentTime);
        wrapper.in(TaskPO::getStatus, TaskStatus.PENDING.name(), TaskStatus.IN_PROGRESS.name(), TaskStatus.EXPIRING.name());
        List<TaskPO> taskPOList = taskDao.selectList(wrapper);
        return TaskConverter.INSTANCE.toEntityList(taskPOList);
    }

    @Override
    public List<Task> findExpiringInstances() {
        return findByStatus(TaskStatus.EXPIRING);
    }

    @Override
    public List<Task> findOverdueInstances() {
        return findByStatus(TaskStatus.OVERDUE);
    }

    @Override
    public List<Task> findBySiteId(Integer siteId) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskPO::getSiteId, siteId);
        wrapper.orderByDesc(TaskPO::getTriggerTime);
        List<TaskPO> taskPOList = taskDao.selectList(wrapper);
        return TaskConverter.INSTANCE.toEntityList(taskPOList);
    }

    @Override
    public List<Task> findByTriggerTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.between(TaskPO::getTriggerTime, startTime, endTime);
        wrapper.orderByDesc(TaskPO::getTriggerTime);
        List<TaskPO> taskPOList = taskDao.selectList(wrapper);
        return TaskConverter.INSTANCE.toEntityList(taskPOList);
    }

    @Override
    public void deleteById(Integer id) {
        taskDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        taskDao.deleteBatchIds(ids);
    }

    @Override
    public Task findByIdWithPlan(Integer id) {
        // TODO: 实现包含计划详情的查询
        return findById(id);
    }

    @Override
    public List<Task> findPendingInstances() {
        return findByStatus(TaskStatus.PENDING);
    }

    @Override
    public List<Task> findInProgressInstances() {
        return findByStatus(TaskStatus.IN_PROGRESS);
    }

    @Override
    public Task findByTaskSchedulerIdAndTriggerTime(Integer taskSchedulerId, LocalDateTime triggerTime) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskPO::getTaskSchedulerId, taskSchedulerId);
        wrapper.eq(TaskPO::getTriggerTime, triggerTime);
        TaskPO taskPO = taskDao.selectOne(wrapper);
        if (taskPO == null) {
            return null;
        }
        return TaskConverter.INSTANCE.toEntity(taskPO);
    }

    @Override
    public Task findBySiteIdAndTriggerTime(Integer siteId, LocalDateTime triggerTime) {
        LambdaQueryWrapper<TaskPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskPO::getSiteId, siteId);
        wrapper.eq(TaskPO::getTriggerTime, triggerTime);
        TaskPO taskPO = taskDao.selectOne(wrapper);
        if (taskPO == null) {
            return null;
        }
        return TaskConverter.INSTANCE.toEntity(taskPO);
    }

    @Override
    public com.baomidou.mybatisplus.core.metadata.IPage<Task> findPageWithDetails(
            Integer pageNum, Integer pageSize,
            String siteName, String status, LocalDateTime startTime, LocalDateTime endTime,
            String creator, Integer departmentId) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<TaskPO> page =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNum, pageSize);
        com.baomidou.mybatisplus.core.metadata.IPage<TaskPO> poPage =
                taskDao.selectPageWithDetails(page, siteName, status, startTime, endTime, creator, departmentId);

        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Task> taskPage =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        taskPage.setRecords(TaskConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return taskPage;
    }
}
