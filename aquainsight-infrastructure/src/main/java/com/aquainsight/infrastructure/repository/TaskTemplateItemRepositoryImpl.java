package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;
import com.aquainsight.domain.maintenance.repository.TaskTemplateItemRepository;
import com.aquainsight.infrastructure.converter.TaskTemplateItemConverter;
import com.aquainsight.infrastructure.db.dao.TaskTemplateItemDao;
import com.aquainsight.infrastructure.db.model.TaskTemplateItemPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 任务模版项目仓储实现
 */
@Repository
@RequiredArgsConstructor
public class TaskTemplateItemRepositoryImpl implements TaskTemplateItemRepository {

    private final TaskTemplateItemDao taskTemplateItemDao;

    @Override
    public TaskTemplateItem save(TaskTemplateItem taskTemplateItem) {
        TaskTemplateItemPO taskTemplateItemPO = TaskTemplateItemConverter.INSTANCE.toPO(taskTemplateItem);
        if (taskTemplateItem.getId() == null) {
            taskTemplateItemDao.insert(taskTemplateItemPO);
        } else {
            taskTemplateItemDao.updateById(taskTemplateItemPO);
        }
        return TaskTemplateItemConverter.INSTANCE.toEntity(taskTemplateItemPO);
    }

    @Override
    public TaskTemplateItem findById(Integer id) {
        TaskTemplateItemPO taskTemplateItemPO = taskTemplateItemDao.selectById(id);
        if (taskTemplateItemPO == null) {
            return null;
        }
        return TaskTemplateItemConverter.INSTANCE.toEntity(taskTemplateItemPO);
    }

    @Override
    public List<TaskTemplateItem> findByTaskTemplateId(Integer taskTemplateId) {
        List<TaskTemplateItemPO> taskTemplateItemPOList = taskTemplateItemDao.selectByTaskTemplateIdWithStepTemplate(taskTemplateId);
        return TaskTemplateItemConverter.INSTANCE.toEntityList(taskTemplateItemPOList);
    }

    @Override
    public void deleteById(Integer id) {
        taskTemplateItemDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        taskTemplateItemDao.deleteBatchIds(ids);
    }

    @Override
    public void deleteByTaskTemplateId(Integer taskTemplateId) {
        LambdaQueryWrapper<TaskTemplateItemPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskTemplateItemPO::getTaskTemplateId, taskTemplateId);
        taskTemplateItemDao.delete(wrapper);
    }
}
