package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.TaskTemplate;
import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;
import com.aquainsight.domain.maintenance.repository.TaskTemplateRepository;
import com.aquainsight.infrastructure.converter.TaskTemplateConverter;
import com.aquainsight.infrastructure.converter.TaskTemplateItemConverter;
import com.aquainsight.infrastructure.db.dao.TaskTemplateDao;
import com.aquainsight.infrastructure.db.dao.TaskTemplateItemDao;
import com.aquainsight.infrastructure.db.model.TaskTemplatePO;
import com.aquainsight.infrastructure.db.model.TaskTemplateItemPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 任务模版仓储实现
 */
@Repository
@RequiredArgsConstructor
public class TaskTemplateRepositoryImpl implements TaskTemplateRepository {

    private final TaskTemplateDao taskTemplateDao;
    private final TaskTemplateItemDao taskTemplateItemDao;

    @Override
    public TaskTemplate save(TaskTemplate taskTemplate) {
        TaskTemplatePO taskTemplatePO = TaskTemplateConverter.INSTANCE.toPO(taskTemplate);
        if (taskTemplate.getId() == null) {
            taskTemplateDao.insert(taskTemplatePO);
        } else {
            taskTemplateDao.updateById(taskTemplatePO);
        }
        return TaskTemplateConverter.INSTANCE.toEntity(taskTemplatePO);
    }

    @Override
    public TaskTemplate findById(Integer id) {
        TaskTemplatePO taskTemplatePO = taskTemplateDao.selectById(id);
        if (taskTemplatePO == null) {
            return null;
        }
        return TaskTemplateConverter.INSTANCE.toEntity(taskTemplatePO);
    }

    @Override
    public TaskTemplate findByCode(String code) {
        LambdaQueryWrapper<TaskTemplatePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskTemplatePO::getCode, code);
        TaskTemplatePO taskTemplatePO = taskTemplateDao.selectOne(wrapper);
        if (taskTemplatePO == null) {
            return null;
        }
        return TaskTemplateConverter.INSTANCE.toEntity(taskTemplatePO);
    }

    @Override
    public List<TaskTemplate> findAll() {
        List<TaskTemplatePO> taskTemplatePOList = taskTemplateDao.selectList(null);
        return TaskTemplateConverter.INSTANCE.toEntityList(taskTemplatePOList);
    }

    @Override
    public List<TaskTemplate> findByNameLike(String name) {
        LambdaQueryWrapper<TaskTemplatePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(TaskTemplatePO::getName, name);
        List<TaskTemplatePO> taskTemplatePOList = taskTemplateDao.selectList(wrapper);
        return TaskTemplateConverter.INSTANCE.toEntityList(taskTemplatePOList);
    }

    @Override
    public void deleteById(Integer id) {
        taskTemplateDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        taskTemplateDao.deleteBatchIds(ids);
    }

    @Override
    public TaskTemplate findByIdWithItems(Integer id) {
        // 使用包含任务模版项的查询方法
        TaskTemplatePO taskTemplatePO = taskTemplateDao.selectByIdWithItems(id);
        if (taskTemplatePO == null) {
            return null;
        }
        return TaskTemplateConverter.INSTANCE.toEntity(taskTemplatePO);
    }
}
