package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.Task;
import com.aquainsight.domain.maintenance.types.TaskStatus;
import com.aquainsight.infrastructure.db.model.TaskPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 任务转换器
 */
@Mapper(uses = {SiteConverter.class, TaskTemplateConverter.class, DepartmentConverter.class, StepConverter.class})
public interface TaskConverter {

    TaskConverter INSTANCE = Mappers.getMapper(TaskConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "status", source = "status", qualifiedByName = "stringToStatus")
    Task toEntity(TaskPO taskPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "status", source = "status", qualifiedByName = "statusToString")
    @Mapping(target = "siteId", expression = "java(task.getSite() != null ? task.getSite().getId() : task.getSiteId())")
    @Mapping(target = "taskTemplateId", expression = "java(task.getTaskTemplate() != null ? task.getTaskTemplate().getId() : task.getTaskTemplateId())")
    @Mapping(target = "departmentId", expression = "java(task.getDepartment() != null ? task.getDepartment().getId() : task.getDepartmentId())")
    @Mapping(target = "site", ignore = true)
    @Mapping(target = "taskTemplate", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "taskScheduler", ignore = true)
    TaskPO toPO(Task task);

    /**
     * PO列表转Entity列表
     */
    List<Task> toEntityList(List<TaskPO> taskPOList);

    /**
     * 字符串转状态枚举
     */
    @Named("stringToStatus")
    default TaskStatus stringToStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }
        return TaskStatus.valueOf(status);
    }

    /**
     * 状态枚举转字符串
     */
    @Named("statusToString")
    default String statusToString(TaskStatus status) {
        if (status == null) {
            return null;
        }
        return status.name();
    }
}
