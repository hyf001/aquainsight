package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.maintenance.entity.TaskScheduler;
import com.aquainsight.domain.maintenance.types.TaskSchedulerState;
import com.aquainsight.domain.maintenance.types.PeriodConfig;
import com.aquainsight.infrastructure.db.model.TaskSchedulerPO;
import com.alibaba.fastjson2.JSON;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 任务调度转换器
 */
@Mapper(uses = {SiteConverter.class, TaskTemplateConverter.class, DepartmentConverter.class})
public interface TaskSchedulerConverter {

    TaskSchedulerConverter INSTANCE = Mappers.getMapper(TaskSchedulerConverter.class);

    /**
     * PO转Entity
     */
    @Mapping(target = "periodConfig", source = "periodConfig", qualifiedByName = "jsonToPeriodConfig")
    @Mapping(target = "taskSchedulerState", source = "taskSchedulerState", qualifiedByName = "stringToTaskSchedulerState")
    TaskScheduler toEntity(TaskSchedulerPO taskSchedulerPO);

    /**
     * Entity转PO
     */
    @Mapping(target = "periodConfig", source = "periodConfig", qualifiedByName = "periodConfigToJson")
    @Mapping(target = "taskSchedulerState", source = "taskSchedulerState", qualifiedByName = "taskSchedulerStateToString")
    @Mapping(target = "siteId", expression = "java(taskScheduler.getSite() != null ? taskScheduler.getSite().getId() : null)")
    @Mapping(target = "taskTemplateId", expression = "java(taskScheduler.getTaskTemplate() != null ? taskScheduler.getTaskTemplate().getId() : null)")
    @Mapping(target = "departmentId", expression = "java(taskScheduler.getDepartment() != null ? taskScheduler.getDepartment().getId() : null)")
    @Mapping(target = "site", ignore = true)
    @Mapping(target = "taskTemplate", ignore = true)
    @Mapping(target = "department", ignore = true)
    TaskSchedulerPO toPO(TaskScheduler taskScheduler);

    /**
     * PO列表转Entity列表
     */
    List<TaskScheduler> toEntityList(List<TaskSchedulerPO> taskSchedulerPOList);

    /**
     * JSON字符串转周期配置对象
     */
    @Named("jsonToPeriodConfig")
    default PeriodConfig jsonToPeriodConfig(String periodConfig) {
        if (periodConfig == null || periodConfig.trim().isEmpty()) {
            return null;
        }
        return JSON.parseObject(periodConfig, PeriodConfig.class);
    }

    /**
     * 周期配置对象转JSON字符串
     */
    @Named("periodConfigToJson")
    default String periodConfigToJson(PeriodConfig periodConfig) {
        if (periodConfig == null) {
            return null;
        }
        return JSON.toJSONString(periodConfig);
    }

    /**
     * 字符串转任务调度状态枚举
     */
    @Named("stringToTaskSchedulerState")
    default TaskSchedulerState stringToTaskSchedulerState(String state) {
        if (state == null || state.trim().isEmpty()) {
            return null;
        }
        try {
            return TaskSchedulerState.valueOf(state);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * 任务调度状态枚举转字符串
     */
    @Named("taskSchedulerStateToString")
    default String taskSchedulerStateToString(TaskSchedulerState taskSchedulerState) {
        if (taskSchedulerState == null) {
            return null;
        }
        return taskSchedulerState.name();
    }
}
