package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.AlertApplicationService;
import com.aquainsight.common.util.PageResult;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.entity.RuleCondition;
import com.aquainsight.domain.alert.service.AlertRuleDomainService;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import com.aquainsight.domain.alert.repository.AlertRecordRepository;
import com.aquainsight.domain.alert.repository.AlertNotifyLogRepository;
import com.aquainsight.interfaces.rest.dto.CreateAlertRuleRequest;
import com.aquainsight.interfaces.rest.dto.HandleAlertRequest;
import com.aquainsight.interfaces.rest.dto.RuleConditionDTO;
import com.aquainsight.interfaces.rest.dto.UpdateAlertRuleRequest;
import com.aquainsight.interfaces.rest.vo.AlertNotifyLogVO;
import com.aquainsight.interfaces.rest.vo.AlertRecordVO;
import com.aquainsight.interfaces.rest.vo.AlertRuleVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 告警管理控制器
 */
@RestController
@RequestMapping("/api/alert")
@RequiredArgsConstructor
public class AlertController {

    private final AlertRuleDomainService alertRuleDomainService;
    private final AlertRecordRepository alertRecordRepository;
    private final AlertNotifyLogRepository alertNotifyLogRepository;
    private final AlertApplicationService alertApplicationService;

    // ==================== Alert Rule Endpoints ====================

    /**
     * 创建告警规则
     */
    @PostMapping("/rules")
    public Response<AlertRuleVO> createAlertRule(@Valid @RequestBody CreateAlertRuleRequest request) {
        try {
            // 转换DTO为领域对象
            List<RuleCondition> conditionConfigs = request.getConditionConfigs().stream()
                    .map(this::convertToRuleCondition)
                    .collect(Collectors.toList());

            AlertRule createdRule = alertRuleDomainService.createRule(
                    request.getRuleName(),
                    AlertTargetType.fromCode(request.getAlertTargetType()),
                    conditionConfigs,
                    AlertLevel.fromCode(request.getAlertLevel()),
                    request.getAlertMessage(),
                    request.getSchemeId(),
                    request.getNotifyTypes(),
                    request.getNotifyUsers(),
                    request.getNotifyDepartments(),
                    request.getQuietPeriod(),
                    request.getDescription(),
                    "system" // TODO: 从当前登录用户获取
            );

            return Response.success(convertToAlertRuleVO(createdRule));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新告警规则
     */
    @PutMapping("/rules/{id}")
    public Response<AlertRuleVO> updateAlertRule(@PathVariable("id") Integer id,
                                                   @RequestBody UpdateAlertRuleRequest request) {
        try {
            // 转换DTO为领域对象
            List<RuleCondition> conditionConfigs = null;
            if (request.getConditionConfigs() != null) {
                conditionConfigs = request.getConditionConfigs().stream()
                        .map(this::convertToRuleCondition)
                        .collect(Collectors.toList());
            }

            AlertTargetType alertTargetType = request.getAlertTargetType() != null
                    ? AlertTargetType.fromCode(request.getAlertTargetType())
                    : null;

            AlertLevel alertLevel = request.getAlertLevel() != null
                    ? AlertLevel.fromCode(request.getAlertLevel())
                    : null;

            AlertRule updatedRule = alertRuleDomainService.updateRule(
                    id,
                    request.getRuleName(),
                    alertTargetType,
                    conditionConfigs,
                    alertLevel,
                    request.getAlertMessage(),
                    request.getSchemeId(),
                    request.getNotifyTypes(),
                    request.getNotifyUsers(),
                    request.getNotifyDepartments(),
                    request.getQuietPeriod(),
                    request.getDescription(),
                    "system" // TODO: 从当前登录用户获取
            );

            return Response.success(convertToAlertRuleVO(updatedRule));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 根据ID获取告警规则
     */
    @GetMapping("/rules/{id}")
    public Response<AlertRuleVO> getAlertRuleById(@PathVariable Integer id) {
        try {
            AlertRule rule = alertRuleDomainService.getRuleById(id);
            return Response.success(convertToAlertRuleVO(rule));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页获取告警规则
     */
    @GetMapping("/rules")
    public Response<PageResult<AlertRuleVO>> getAllAlertRules(
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "alertTargetType", required = false) String alertTargetType,
            @RequestParam(value = "enabled", required = false) Integer enabled) {
        try {
            List<AlertRule> rules;

            if (alertTargetType != null && enabled != null && enabled == 1) {
                rules = alertRuleDomainService.getEnabledRulesByType(AlertTargetType.fromCode(alertTargetType));
            } else if (enabled != null && enabled == 1) {
                rules = alertRuleDomainService.getAllEnabledRules();
            } else {
                rules = alertRuleDomainService.getAllRules();
            }

            // 手动分页处理
            int total = rules.size();
            int start = (pageNum - 1) * pageSize;
            int end = Math.min(start + pageSize, total);

            List<AlertRule> pagedRules = start < total ? rules.subList(start, end) : new ArrayList<>();

            List<AlertRuleVO> ruleVOs = pagedRules.stream()
                    .map(this::convertToAlertRuleVO)
                    .collect(Collectors.toList());

            PageResult<AlertRuleVO> pageResult = PageResult.of(ruleVOs, (long) total, pageNum, pageSize);
            return Response.success(pageResult);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 启用告警规则
     */
    @PutMapping("/rules/{id}/enable")
    public Response<AlertRuleVO> enableAlertRule(@PathVariable Integer id) {
        try {
            AlertRule rule = alertRuleDomainService.enableRule(id);
            return Response.success(convertToAlertRuleVO(rule));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 禁用告警规则
     */
    @PutMapping("/rules/{id}/disable")
    public Response<AlertRuleVO> disableAlertRule(@PathVariable Integer id) {
        try {
            AlertRule rule = alertRuleDomainService.disableRule(id);
            return Response.success(convertToAlertRuleVO(rule));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除告警规则
     */
    @DeleteMapping("/rules/{id}")
    public Response<Void> deleteAlertRule(@PathVariable Integer id) {
        try {
            alertRuleDomainService.deleteRule(id);
            return Response.success(null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取指标列表
     * 根据目标类型返回支持的指标名称列表
     */
    @GetMapping("/metrics")
    public Response<List<String>> getMetrics(@RequestParam(value = "targetType", required = false) String targetType) {
        try {
            List<String> metrics = new java.util.ArrayList<>();

            if (targetType != null) {
                // 返回指定目标类型支持的指标
                AlertTargetType type = AlertTargetType.fromCode(targetType);
                metrics.addAll(type.getSupportedMetrics());
            } else {
                // 返回所有目标类型的指标（去重）
                for (AlertTargetType type : AlertTargetType.values()) {
                    for (String metric : type.getSupportedMetrics()) {
                        if (!metrics.contains(metric)) {
                            metrics.add(metric);
                        }
                    }
                }
            }

            return Response.success(metrics);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== Alert Record Endpoints ====================

    /**
     * 根据ID获取告警记录
     */
    @GetMapping("/records/{id}")
    public Response<AlertRecordVO> getAlertRecordById(@PathVariable Integer id) {
        try {
            Optional<AlertRecord> recordOpt = alertRecordRepository.findById(id);
            if (!recordOpt.isPresent()) {
                return Response.error("告警记录不存在");
            }
            return Response.success(convertToAlertRecordVO(recordOpt.get()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页查询告警记录
     */
    @GetMapping("/records")
    public Response<PageResult<AlertRecordVO>> getAlertRecords(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String alertLevel,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            AlertStatus alertStatus = status != null ? AlertStatus.valueOf(status) : null;
            AlertLevel level = alertLevel != null ? AlertLevel.valueOf(alertLevel) : null;
            AlertTargetType target = targetType != null ? AlertTargetType.fromCode(targetType) : null;

            IPage<AlertRecord> recordPage = alertRecordRepository.findPage(
                    pageNum, pageSize, alertStatus, level, target, startTime, endTime);

            List<AlertRecordVO> recordVOs = recordPage.getRecords().stream()
                    .map(this::convertToAlertRecordVO)
                    .collect(Collectors.toList());

            PageResult<AlertRecordVO> pageResult = PageResult.of(
                    recordVOs,
                    recordPage.getTotal(),
                    (int) recordPage.getCurrent(),
                    (int) recordPage.getSize()
            );

            return Response.success(pageResult);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 开始处理告警
     */
    @PutMapping("/records/{id}/start-process")
    public Response<AlertRecordVO> startProcessAlert(@PathVariable Integer id) {
        try {
            Optional<AlertRecord> recordOpt = alertRecordRepository.findById(id);
            if (!recordOpt.isPresent()) {
                return Response.error("告警记录不存在");
            }

            AlertRecord record = recordOpt.get();
            record.startProcess();
            AlertRecord updatedRecord = alertRecordRepository.update(record);

            return Response.success(convertToAlertRecordVO(updatedRecord));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 解决告警
     */
    @PutMapping("/records/{id}/resolve")
    public Response<AlertRecordVO> resolveAlert(@PathVariable Integer id,
                                                  @RequestBody HandleAlertRequest request) {
        try {
            Optional<AlertRecord> recordOpt = alertRecordRepository.findById(id);
            if (!recordOpt.isPresent()) {
                return Response.error("告警记录不存在");
            }

            AlertRecord record = recordOpt.get();
            record.resolve(request.getRemark());
            AlertRecord updatedRecord = alertRecordRepository.update(record);

            return Response.success(convertToAlertRecordVO(updatedRecord));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 忽略告警
     */
    @PutMapping("/records/{id}/ignore")
    public Response<AlertRecordVO> ignoreAlert(@PathVariable Integer id,
                                                 @RequestBody HandleAlertRequest request) {
        try {
            Optional<AlertRecord> recordOpt = alertRecordRepository.findById(id);
            if (!recordOpt.isPresent()) {
                return Response.error("告警记录不存在");
            }

            AlertRecord record = recordOpt.get();
            record.ignore(request.getRemark());
            AlertRecord updatedRecord = alertRecordRepository.update(record);

            return Response.success(convertToAlertRecordVO(updatedRecord));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取告警统计信息
     */
    @GetMapping("/records/statistics")
    public Response<java.util.Map<String, Object>> getAlertStatistics() {
        try {
            long pendingCount = alertRecordRepository.countByStatus(AlertStatus.PENDING);
            long inProgressCount = alertRecordRepository.countByStatus(AlertStatus.IN_PROGRESS);
            long resolvedCount = alertRecordRepository.countByStatus(AlertStatus.RESOLVED);
            long ignoredCount = alertRecordRepository.countByStatus(AlertStatus.IGNORED);
            long recoveredCount = alertRecordRepository.countByStatus(AlertStatus.RECOVERED);

            long urgentCount = alertRecordRepository.countByAlertLevel(AlertLevel.URGENT);
            long importantCount = alertRecordRepository.countByAlertLevel(AlertLevel.IMPORTANT);

            java.util.Map<String, Object> statistics = new java.util.HashMap<>();
            statistics.put("pendingCount", pendingCount);
            statistics.put("inProgressCount", inProgressCount);
            statistics.put("resolvedCount", resolvedCount);
            statistics.put("ignoredCount", ignoredCount);
            statistics.put("recoveredCount", recoveredCount);
            statistics.put("urgentCount", urgentCount);
            statistics.put("importantCount", importantCount);

            return Response.success(statistics);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== Alert Notify Log Endpoints ====================

    /**
     * 根据告警记录ID获取通知日志
     */
    @GetMapping("/records/{alertRecordId}/notify-logs")
    public Response<List<AlertNotifyLogVO>> getNotifyLogsByAlertRecordId(@PathVariable Integer alertRecordId) {
        try {
            List<AlertNotifyLog> logs = alertNotifyLogRepository.findByAlertRecordId(alertRecordId);
            List<AlertNotifyLogVO> logVOs = logs.stream()
                    .map(this::convertToAlertNotifyLogVO)
                    .collect(Collectors.toList());
            return Response.success(logVOs);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    // ==================== Conversion Methods ====================

    private AlertRuleVO convertToAlertRuleVO(AlertRule rule) {
        List<RuleConditionDTO> conditionDTOs = rule.getConditionConfigs() != null
                ? rule.getConditionConfigs().stream()
                        .map(this::convertToRuleConditionDTO)
                        .collect(Collectors.toList())
                : null;

        return AlertRuleVO.builder()
                .id(rule.getId())
                .ruleName(rule.getRuleName())
                .alertTargetType(rule.getAlertTargetType().getCode())
                .conditionConfigs(conditionDTOs)
                .alertLevel(rule.getAlertLevel().getCode())
                .alertMessage(rule.getAlertMessage())
                .schemeId(rule.getSchemeId())
                .notifyTypes(rule.getNotifyTypes())
                .notifyUsers(rule.getNotifyUsers())
                .notifyDepartments(rule.getNotifyDepartments())
                .enabled(rule.getEnabled())
                .quietPeriod(rule.getQuietPeriod())
                .description(rule.getDescription())
                .creator(rule.getCreator())
                .createTime(rule.getCreateTime())
                .updateTime(rule.getUpdateTime())
                .build();
    }

    private AlertRecordVO convertToAlertRecordVO(AlertRecord record) {
        return AlertRecordVO.builder()
                .id(record.getId())
                .ruleId(record.getRuleId())
                .ruleName(record.getRuleName())
                .ruleType(record.getRuleType() != null ? record.getRuleType().name() : null)
                .targetType(record.getTargetType() != null ? record.getTargetType().getCode() : null)
                .targetId(record.getTargetId())
                .targetName(record.getTargetName())
                .alertLevel(record.getAlertLevel() != null ? record.getAlertLevel().name() : null)
                .alertMessage(record.getAlertMessage())
                .alertData(record.getAlertData())
                .status(record.getStatus() != null ? record.getStatus().name() : null)
                .notifyStatus(record.getNotifyStatus() != null ? record.getNotifyStatus().name() : null)
                .notifyTime(record.getNotifyTime())
                .recoverTime(record.getRecoverTime())
                .duration(record.getDuration())
                .remark(record.getRemark())
                .isSelfTask(record.getIsSelfTask())
                .createTime(record.getCreateTime())
                .updateTime(record.getUpdateTime())
                .build();
    }

    private AlertNotifyLogVO convertToAlertNotifyLogVO(AlertNotifyLog log) {
        return AlertNotifyLogVO.builder()
                .id(log.getId())
                .alertRecordId(log.getAlertRecordId())
                .notifyType(log.getNotifyType() != null ? log.getNotifyType().getCode() : null)
                .notifyTarget(log.getNotifyTarget())
                .notifyUserId(log.getNotifyUserId())
                .notifyUserName(log.getNotifyUserName())
                .notifyContent(log.getNotifyContent())
                .notifyStatus(log.getNotifyStatus() != null ? log.getNotifyStatus().name() : null)
                .sendTime(log.getSendTime())
                .errorMessage(log.getErrorMessage())
                .retryCount(log.getRetryCount())
                .createTime(log.getCreateTime())
                .build();
    }

    private RuleConditionDTO convertToRuleConditionDTO(RuleCondition condition) {
        return RuleConditionDTO.builder()
                .metric(condition.getMetric())
                .operator(condition.getOperator() != null ? condition.getOperator().name() : null)
                .threshold(condition.getThreshold())
                .minThreshold(condition.getMinThreshold())
                .maxThreshold(condition.getMaxThreshold())
                .build();
    }

    private RuleCondition convertToRuleCondition(RuleConditionDTO dto) {
        return RuleCondition.builder()
                .metric(dto.getMetric())
                .operator(RuleCondition.ComparisonOperator.valueOf(dto.getOperator()))
                .threshold(dto.getThreshold())
                .minThreshold(dto.getMinThreshold())
                .maxThreshold(dto.getMaxThreshold())
                .build();
    }
}
