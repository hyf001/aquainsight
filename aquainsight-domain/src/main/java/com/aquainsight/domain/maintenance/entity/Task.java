package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.*;
import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.organization.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 任务
 * 任务可以调度生成，也可以手动生成
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    /**
     * 任务ID
     */
    private Integer id;

    /**
     * 站点ID (直接存储,不依赖任务调度)
     */
    private Integer siteId;

    /**
     * 站点 (关联对象,用于查询时填充)
     */
    private Site site;

    /**
     * 任务模版ID 
     */
    private Integer taskTemplateId;

    /**
     * 任务模版 (关联对象,用于查询时填充)
     */
    private TaskTemplate taskTemplate;

    /**
     * 部门ID (直接存储,不依赖任务调度)
     */
    private Integer departmentId;

    /**
     * 部门 (关联对象,用于查询时填充)
     */
    private Department department;

    /**
     * 任务调度 (可选,如果是从计划生成的任务则有值)
     */
    private Integer taskSchedulerId;

    /**
     * 任务派发时间
     */
    private LocalDateTime triggerTime;

    /**
     * 任务开始时间
     */
    private LocalDateTime startTime;

    /**
     * 任务结束时间
     */
    private LocalDateTime endTime;

    /**
     * 任务状态
     */
    private TaskStatus status;

    /**
     * 任务过期时间
     */
    private LocalDateTime expiredTime;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 任务处理人
     */
    private String operator;

    /**
     * 步骤执行列表
     */
    private List<Step> steps;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 开始任务
     */
    public void start(String operator) {
        if (this.status == TaskStatus.PENDING || this.status == TaskStatus.EXPIRING) {
            this.status = TaskStatus.IN_PROGRESS;
            this.startTime = LocalDateTime.now();
            this.operator = operator;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理或即将过期状态的任务才能开始执行");
        }
    }

    /**
     * 完成任务
     */
    public void complete() {
        if (this.status == TaskStatus.IN_PROGRESS) {
            this.status = TaskStatus.COMPLETED;
            this.endTime = LocalDateTime.now();
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有进行中的任务才能完成");
        }
    }

    /**
     * 取消任务
     */
    public void cancel() {
        if (this.status == TaskStatus.PENDING
            || this.status == TaskStatus.IN_PROGRESS
            || this.status == TaskStatus.EXPIRING) {
            this.status = TaskStatus.CANCELLED;
            this.endTime = LocalDateTime.now();
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理、进行中或即将过期的任务才能取消");
        }
    }

    /**
     * 检查并更新过期状态（即将过期或已逾期）
     * @param expiringThresholdHours 即将过期的阈值（小时数）
     */
    public void checkAndUpdateExpirationStatus(int expiringThresholdHours) {
        if (this.expiredTime == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiringThreshold = this.expiredTime.minusHours(expiringThresholdHours);

        // 只处理待处理、进行中和即将过期的任务
        if (this.status != TaskStatus.PENDING
            && this.status != TaskStatus.IN_PROGRESS
            && this.status != TaskStatus.EXPIRING) {
            return;
        }

        // 已经过期，标记为逾期
        if (now.isAfter(this.expiredTime)) {
            this.status = TaskStatus.OVERDUE;
            this.updateTime = now;
        }
        // 即将过期但还未过期
        else if (now.isAfter(expiringThreshold)) {
            this.status = TaskStatus.EXPIRING;
            this.updateTime = now;
        }
    }

    /**
     * 检查并标记为逾期（兼容旧方法）
     */
    @Deprecated
    public void checkAndMarkOverdue() {
        checkAndUpdateExpirationStatus(24);
    }

    /**
     * 是否逾期
     */
    public boolean isOverdue() {
        return this.status == TaskStatus.OVERDUE;
    }

    /**
     * 是否已完成
     */
    public boolean isCompleted() {
        return this.status == TaskStatus.COMPLETED;
    }

    /**
     * 是否可以开始
     */
    public boolean canStart() {
        return this.status == TaskStatus.PENDING || this.status == TaskStatus.EXPIRING;
    }

    /**
     * 是否可以完成
     */
    public boolean canComplete() {
        return this.status == TaskStatus.IN_PROGRESS;
    }

    /**
     * 更新处理人
     */
    public void updateOperator(String operator) {
        if (this.status == TaskStatus.PENDING
            || this.status == TaskStatus.IN_PROGRESS
            || this.status == TaskStatus.EXPIRING) {
            this.operator = operator;
            this.updateTime = LocalDateTime.now();
        } else {
            throw new IllegalStateException("只有待处理、进行中或即将过期的任务才能更新处理人");
        }
    }

    /**
     * 计算任务执行时长（分钟）
     */
    public Long getExecutionDuration() {
        if (this.startTime == null) {
            return 0L;
        }
        LocalDateTime end = this.endTime != null ? this.endTime : LocalDateTime.now();
        return java.time.Duration.between(this.startTime, end).toMinutes();
    }

    /**
     * 是否在执行中
     */
    public boolean isInProgress() {
        return this.status == TaskStatus.IN_PROGRESS;
    }

    // ==================== 步骤执行相关方法 ====================

    /**
     * 初始化步骤列表（如果为空）
     */
    private void ensureSteps() {
        if (this.steps == null) {
            this.steps = new ArrayList<>();
        }
    }

    /**
     * 填写步骤参数
     * @param stepTemplateId 步骤模板ID
     * @param stepName 步骤名称
     * @param parameterValues 参数值Map（参数名 -> 参数值）
     */
    public void fillStepParameters(Integer stepTemplateId,
                                    String stepName,
                                    Map<String, Object> parameterValues) {
        ensureSteps();

        // 获取或创建步骤
        Step step = getStep(stepTemplateId);
        if (step == null) {
            step = Step.builder()
                    .taskId(this.id)
                    .stepTemplateId(stepTemplateId)
                    .stepName(stepName)
                    .createTime(LocalDateTime.now())
                    .updateTime(LocalDateTime.now())
                    .build();
            steps.add(step);
        }

        // 更新参数值
        for (Map.Entry<String, Object> entry : parameterValues.entrySet()) {
            ParameterValue paramValue = ParameterValue.builder()
                    .name(entry.getKey())
                    .value(entry.getValue())
                    .fillTime(LocalDateTime.now())
                    .build();
            step.addOrUpdateParameter(paramValue);
        }

        this.updateTime = LocalDateTime.now();
    }

    /**
     * 获取指定步骤
     * @param stepTemplateId 步骤模板ID
     * @return 步骤
     */
    public Step getStep(Integer stepTemplateId) {
        if (steps == null) {
            return null;
        }
        return steps.stream()
                .filter(s -> s.getStepTemplateId().equals(stepTemplateId))
                .findFirst()
                .orElse(null);
    }

    /**
     * 验证所有必填参数是否已填写
     * @param template 任务模板
     * @return 是否所有必填参数已填写
     */
    public boolean validateAllRequiredParameters(TaskTemplate template) {
        if (template == null || template.getItems() == null) {
            return true;
        }

        if (steps == null || steps.isEmpty()) {
            // 检查是否所有步骤都没有必填参数
            for (TaskTemplateItem item : template.getItems()) {
                StepTemplate stepTemplate = item.getStepTemplate();
                if (stepTemplate != null && stepTemplate.getParameters() != null) {
                    boolean hasRequired = stepTemplate.getParameters().stream()
                            .anyMatch(p -> Boolean.TRUE.equals(p.getRequired()));
                    if (hasRequired) {
                        return false;
                    }
                }
            }
            return true;
        }

        for (TaskTemplateItem item : template.getItems()) {
            StepTemplate stepTemplate = item.getStepTemplate();
            if (stepTemplate == null || stepTemplate.getParameters() == null) {
                continue;
            }

            Step step = getStep(item.getStepTemplateId());
            if (step == null) {
                // 检查是否有必填参数
                boolean hasRequired = stepTemplate.getParameters().stream()
                        .anyMatch(p -> Boolean.TRUE.equals(p.getRequired()));
                if (hasRequired) {
                    return false;
                }
            } else {
                // 验证必填参数
                if (!step.validateRequired(stepTemplate.getParameters())) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 判断是否可以完成任务（需要验证必填参数）
     * @param template 任务模板
     * @return 是否可以完成
     */
    public boolean canComplete(TaskTemplate template) {
        return this.status == TaskStatus.IN_PROGRESS &&
                validateAllRequiredParameters(template);
    }

    /**
     * 获取任务进度百分比
     * @param template 任务模板
     * @return 进度百分比（0-100）
     */
    public int getProgress(TaskTemplate template) {
        if (template == null || template.getItems() == null || template.getItems().isEmpty()) {
            return 0;
        }

        if (steps == null || steps.isEmpty()) {
            return 0;
        }

        int totalSteps = template.getItems().size();
        int completedSteps = 0;

        for (TaskTemplateItem item : template.getItems()) {
            Step step = getStep(item.getStepTemplateId());
            if (step != null && step.hasAnyParameter()) {
                completedSteps++;
            }
        }

        return (completedSteps * 100) / totalSteps;
    }
}
