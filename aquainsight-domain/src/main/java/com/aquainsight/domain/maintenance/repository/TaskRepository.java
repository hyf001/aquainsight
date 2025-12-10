package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.Task;
import com.aquainsight.domain.maintenance.types.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务仓储接口
 */
public interface TaskRepository {

    /**
     * 保存任务
     */
    Task save(Task task);

    /**
     * 根据ID查询任务
     */
    Task findById(Integer id);

    /**
     * 根据任务调度ID查询所有任务
     */
    List<Task> findByTaskSchedulerId(Integer taskSchedulerId);

    /**
     * 根据状态查询任务
     */
    List<Task> findByStatus(TaskStatus status);

    /**
     * 根据处理人查询任务
     */
    List<Task> findByOperator(String operator);

    /**
     * 查询需要检查是否逾期的任务（待处理和进行中的任务）
     */
    List<Task> findInstancesToCheckOverdue(LocalDateTime currentTime);

    /**
     * 根据站点ID查询任务
     */
    List<Task> findBySiteId(Integer siteId);

    /**
     * 根据时间范围查询任务
     */
    List<Task> findByTriggerTimeRange(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 删除任务
     */
    void deleteById(Integer id);

    /**
     * 批量删除任务
     */
    void deleteByIds(List<Integer> ids);

    /**
     * 根据ID查询任务（包含任务调度详情）
     */
    Task findByIdWithPlan(Integer id);

    /**
     * 查询待处理的任务
     */
    List<Task> findPendingInstances();

    /**
     * 查询进行中的任务
     */
    List<Task> findInProgressInstances();

    /**
     * 查询所有即将过期的任务（状态为EXPIRING）
     */
    List<Task> findExpiringInstances();

    /**
     * 查询所有已过期的任务（状态为OVERDUE）
     */
    List<Task> findOverdueInstances();

    /**
     * 根据任务调度ID和派发时间查询任务
     */
    Task findByTaskSchedulerIdAndTriggerTime(Integer taskSchedulerId, LocalDateTime triggerTime);

    /**
     * 根据站点ID和派发时间查询任务
     */
    Task findBySiteIdAndTriggerTime(Integer siteId, LocalDateTime triggerTime);

    /**
     * 分页查询任务（包含关联的任务调度详情）
     */
    com.baomidou.mybatisplus.core.metadata.IPage<Task> findPageWithDetails(
            Integer pageNum, Integer pageSize,
            String siteName, String status, LocalDateTime startTime, LocalDateTime endTime,
            String creator, Integer departmentId);
}
