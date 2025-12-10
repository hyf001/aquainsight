package com.aquainsight.domain.alert.repository;

import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Optional;

/**
 * 告警规则仓储接口
 */
public interface AlertRuleRepository {

    /**
     * 保存告警规则
     */
    AlertRule save(AlertRule alertRule);

    /**
     * 根据ID查找告警规则
     */
    Optional<AlertRule> findById(Integer id);

    /**
     * 查找所有告警规则
     */
    List<AlertRule> findAll();

    /**
     * 查找所有启用的告警规则
     */
    List<AlertRule> findAllEnabled();

    /**
     * 根据告警对象类型查找启用的告警规则
     */
    List<AlertRule> findEnabledByAlertTargetType(AlertTargetType alertTargetType);

    /**
     * 根据任务模版ID查找告警规则
     */
    List<AlertRule> findByTaskTemplateId(Integer taskTemplateId);

    /**
     * 更新告警规则
     */
    AlertRule update(AlertRule alertRule);

    /**
     * 根据ID删除告警规则
     */
    boolean deleteById(Integer id);

    /**
     * 分页查询告警规则
     */
    IPage<AlertRule> findPage(Integer pageNum, Integer pageSize, AlertTargetType alertTargetType, Integer enabled);

    /**
     * 检查规则名称是否存在
     */
    boolean existsByRuleName(String ruleName);

    /**
     * 根据规则名称查找
     */
    Optional<AlertRule> findByRuleName(String ruleName);
}
