package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.alert.entity.AlertRule;
import com.aquainsight.domain.alert.repository.AlertRuleRepository;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.infrastructure.converter.AlertRuleConverter;
import com.aquainsight.infrastructure.db.dao.AlertRuleDao;
import com.aquainsight.infrastructure.db.model.AlertRulePO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 告警规则仓储实现
 */
@Repository
@RequiredArgsConstructor
public class AlertRuleRepositoryImpl implements AlertRuleRepository {

    private final AlertRuleDao alertRuleDao;
    private final AlertRuleConverter converter = AlertRuleConverter.INSTANCE;

    @Override
    public AlertRule save(AlertRule alertRule) {
        AlertRulePO po = converter.toPO(alertRule);
        alertRuleDao.insert(po);
        return converter.toEntity(po);
    }

    @Override
    public Optional<AlertRule> findById(Integer id) {
        AlertRulePO po = alertRuleDao.selectById(id);
        return Optional.ofNullable(po).map(converter::toEntity);
    }

    @Override
    public List<AlertRule> findAll() {
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(AlertRulePO::getCreateTime);
        List<AlertRulePO> poList = alertRuleDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRule> findAllEnabled() {
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRulePO::getEnabled, 1);
        queryWrapper.orderByDesc(AlertRulePO::getCreateTime);
        List<AlertRulePO> poList = alertRuleDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRule> findEnabledByAlertTargetType(AlertTargetType alertTargetType) {
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRulePO::getEnabled, 1);
        queryWrapper.eq(AlertRulePO::getAlertTargetType, alertTargetType.getCode());
        queryWrapper.orderByDesc(AlertRulePO::getCreateTime);
        List<AlertRulePO> poList = alertRuleDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRule> findBySchemeId(Integer schemeId) {
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRulePO::getSchemeId, schemeId);
        queryWrapper.orderByDesc(AlertRulePO::getCreateTime);
        List<AlertRulePO> poList = alertRuleDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public AlertRule update(AlertRule alertRule) {
        AlertRulePO po = converter.toPO(alertRule);
        alertRuleDao.updateById(po);
        return converter.toEntity(po);
    }

    @Override
    public boolean deleteById(Integer id) {
        return alertRuleDao.deleteById(id) > 0;
    }

    @Override
    public IPage<AlertRule> findPage(Integer pageNum, Integer pageSize, AlertTargetType alertTargetType, Integer enabled) {
        Page<AlertRulePO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();

        if (alertTargetType != null) {
            queryWrapper.eq(AlertRulePO::getAlertTargetType, alertTargetType.getCode());
        }

        if (enabled != null) {
            queryWrapper.eq(AlertRulePO::getEnabled, enabled);
        }

        queryWrapper.orderByDesc(AlertRulePO::getCreateTime);

        IPage<AlertRulePO> poPage = alertRuleDao.selectPage(page, queryWrapper);

        // 转换为实体分页对象
        Page<AlertRule> entityPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        List<AlertRule> entityList = poPage.getRecords().stream()
                .map(converter::toEntity)
                .collect(Collectors.toList());
        entityPage.setRecords(entityList);

        return entityPage;
    }

    @Override
    public boolean existsByRuleName(String ruleName) {
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRulePO::getRuleName, ruleName);
        return alertRuleDao.selectCount(queryWrapper) > 0;
    }

    @Override
    public Optional<AlertRule> findByRuleName(String ruleName) {
        LambdaQueryWrapper<AlertRulePO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRulePO::getRuleName, ruleName);
        AlertRulePO po = alertRuleDao.selectOne(queryWrapper);
        return Optional.ofNullable(po).map(converter::toEntity);
    }
}
