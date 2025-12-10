package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.TaskTemplate;
import com.aquainsight.domain.maintenance.entity.TaskTemplateItem;
import com.aquainsight.domain.maintenance.repository.TaskTemplateRepository;
import com.aquainsight.domain.maintenance.repository.TaskTemplateItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务模版领域服务
 */
@Service
@RequiredArgsConstructor
public class TaskTemplateDomainService {

    private final TaskTemplateRepository taskTemplateRepository;
    private final TaskTemplateItemRepository taskTemplateItemRepository;

    /**
     * 创建任务模版
     */
    public TaskTemplate createTaskTemplate(String name, String code, String creator) {
        // 领域规则验证
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("任务模版名称不能为空");
        }
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("任务模版编码不能为空");
        }

        // 检查编码是否已存在
        TaskTemplate existingTaskTemplate = taskTemplateRepository.findByCode(code);
        if (existingTaskTemplate != null) {
            throw new IllegalArgumentException("任务模版编码已存在");
        }

        TaskTemplate taskTemplate = TaskTemplate.builder()
                .name(name)
                .code(code)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return taskTemplateRepository.save(taskTemplate);
    }

    /**
     * 更新任务模版信息
     */
    public TaskTemplate updateTaskTemplateInfo(Integer taskTemplateId, String name, String updater) {
        TaskTemplate taskTemplate = taskTemplateRepository.findById(taskTemplateId);
        if (taskTemplate == null) {
            throw new IllegalArgumentException("任务模版不存在");
        }

        taskTemplate.updateInfo(name, updater);
        return taskTemplateRepository.save(taskTemplate);
    }

    /**
     * 根据ID获取任务模版
     */
    public TaskTemplate getTaskTemplateById(Integer taskTemplateId) {
        return taskTemplateRepository.findById(taskTemplateId);
    }

    /**
     * 根据ID获取任务模版（包含任务模版项目）
     */
    public TaskTemplate getTaskTemplateByIdWithItems(Integer taskTemplateId) {
        return taskTemplateRepository.findByIdWithItems(taskTemplateId);
    }

    /**
     * 获取所有任务模版
     */
    public List<TaskTemplate> getAllTaskTemplates() {
        return taskTemplateRepository.findAll();
    }

    /**
     * 根据名称模糊查询
     */
    public List<TaskTemplate> searchTaskTemplatesByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return taskTemplateRepository.findAll();
        }
        return taskTemplateRepository.findByNameLike(name);
    }

    /**
     * 删除任务模版
     */
    public void deleteTaskTemplate(Integer taskTemplateId) {
        TaskTemplate taskTemplate = taskTemplateRepository.findById(taskTemplateId);
        if (taskTemplate == null) {
            throw new IllegalArgumentException("任务模版不存在");
        }
        // 删除任务模版时，同时删除任务模版项目
        taskTemplateItemRepository.deleteByTaskTemplateId(taskTemplateId);
        taskTemplateRepository.deleteById(taskTemplateId);
    }

    /**
     * 批量删除任务模版
     */
    public void deleteTaskTemplates(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        // 删除所有任务模版的任务模版项目
        for (Integer id : ids) {
            taskTemplateItemRepository.deleteByTaskTemplateId(id);
        }
        taskTemplateRepository.deleteByIds(ids);
    }

    /**
     * 添加任务模版项目
     */
    public TaskTemplateItem addTaskTemplateItem(Integer taskTemplateId, TaskTemplateItem taskTemplateItem) {
        TaskTemplate taskTemplate = taskTemplateRepository.findById(taskTemplateId);
        if (taskTemplate == null) {
            throw new IllegalArgumentException("任务模版不存在");
        }
        taskTemplateItem.setTaskTemplateId(taskTemplateId);
        taskTemplateItem.setCreateTime(LocalDateTime.now());
        taskTemplateItem.setUpdateTime(LocalDateTime.now());
        taskTemplateItem.setDeleted(0);
        return taskTemplateItemRepository.save(taskTemplateItem);
    }

    /**
     * 更新任务模版项目
     */
    public TaskTemplateItem updateTaskTemplateItem(TaskTemplateItem taskTemplateItem) {
        TaskTemplateItem existingItem = taskTemplateItemRepository.findById(taskTemplateItem.getId());
        if (existingItem == null) {
            throw new IllegalArgumentException("任务模版项目不存在");
        }
        return taskTemplateItemRepository.save(taskTemplateItem);
    }

    /**
     * 删除任务模版项目
     */
    public void deleteTaskTemplateItem(Integer taskTemplateItemId) {
        TaskTemplateItem taskTemplateItem = taskTemplateItemRepository.findById(taskTemplateItemId);
        if (taskTemplateItem == null) {
            throw new IllegalArgumentException("任务模版项目不存在");
        }
        taskTemplateItemRepository.deleteById(taskTemplateItemId);
    }

    /**
     * 获取任务模版的所有项目
     */
    public List<TaskTemplateItem> getTaskTemplateItems(Integer taskTemplateId) {
        return taskTemplateItemRepository.findByTaskTemplateId(taskTemplateId);
    }
}
