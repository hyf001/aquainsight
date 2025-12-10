package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.TaskScheduler;
import com.aquainsight.domain.maintenance.repository.TaskSchedulerRepository;
import com.aquainsight.infrastructure.converter.TaskSchedulerConverter;
import com.aquainsight.infrastructure.db.dao.TaskSchedulerDao;
import com.aquainsight.infrastructure.db.model.TaskSchedulerPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 站点任务调度仓储实现
 */
@Repository
@RequiredArgsConstructor
public class TaskSchedulerRepositoryImpl implements TaskSchedulerRepository {

    private final TaskSchedulerDao taskSchedulerDao;

    @Override
    public TaskScheduler save(TaskScheduler taskScheduler) {
        TaskSchedulerPO taskSchedulerPO = TaskSchedulerConverter.INSTANCE.toPO(taskScheduler);
        if (taskScheduler.getId() == null) {
            taskSchedulerDao.insert(taskSchedulerPO);
        } else {
            taskSchedulerDao.updateById(taskSchedulerPO);
        }
        return TaskSchedulerConverter.INSTANCE.toEntity(taskSchedulerPO);
    }

    @Override
    public TaskScheduler findById(Integer id) {
        TaskSchedulerPO taskSchedulerPO = taskSchedulerDao.selectById(id);
        if (taskSchedulerPO == null) {
            return null;
        }
        return TaskSchedulerConverter.INSTANCE.toEntity(taskSchedulerPO);
    }

    @Override
    public TaskScheduler findBySiteId(Integer siteId) {
        LambdaQueryWrapper<TaskSchedulerPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskSchedulerPO::getSiteId, siteId);
        TaskSchedulerPO taskSchedulerPO = taskSchedulerDao.selectOne(wrapper);
        if (taskSchedulerPO == null) {
            return null;
        }
        return TaskSchedulerConverter.INSTANCE.toEntity(taskSchedulerPO);
    }

    @Override
    public TaskScheduler findByIdWithDetails(Integer id) {
        TaskSchedulerPO taskSchedulerPO = taskSchedulerDao.selectByIdWithDetails(id);
        if (taskSchedulerPO == null) {
            return null;
        }
        return TaskSchedulerConverter.INSTANCE.toEntity(taskSchedulerPO);
    }

    @Override
    public TaskScheduler findBySiteIdWithDetails(Integer siteId) {
        TaskSchedulerPO taskSchedulerPO = taskSchedulerDao.selectBySiteIdWithDetails(siteId);
        if (taskSchedulerPO == null) {
            return null;
        }
        return TaskSchedulerConverter.INSTANCE.toEntity(taskSchedulerPO);
    }

    @Override
    public List<TaskScheduler> findAll() {
        List<TaskSchedulerPO> taskSchedulerPOList = taskSchedulerDao.selectList(null);
        return TaskSchedulerConverter.INSTANCE.toEntityList(taskSchedulerPOList);
    }

    @Override
    public void deleteById(Integer id) {
        taskSchedulerDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        taskSchedulerDao.deleteBatchIds(ids);
    }

    @Override
    public IPage<TaskScheduler> findPageWithDetails(Integer pageNum, Integer pageSize,
                                                   String siteName, List<Integer> siteIds,
                                                   Integer departmentId) {
        Page<TaskSchedulerPO> page = new Page<>(pageNum, pageSize);
        IPage<TaskSchedulerPO> poPage = taskSchedulerDao.selectPageWithDetails(
                page, siteName, siteIds, departmentId);

        Page<TaskScheduler> taskSchedulerPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        taskSchedulerPage.setRecords(TaskSchedulerConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return taskSchedulerPage;
    }

    @Override
    public List<TaskScheduler> findActiveTaskSchedulersWithDetails() {
        List<TaskSchedulerPO> taskSchedulerPOList = taskSchedulerDao.selectActiveTaskSchedulersWithDetails();
        return TaskSchedulerConverter.INSTANCE.toEntityList(taskSchedulerPOList);
    }
}
