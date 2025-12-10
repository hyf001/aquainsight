package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.alert.entity.AlertRecord;
import com.aquainsight.domain.alert.repository.AlertRecordRepository;
import com.aquainsight.domain.alert.types.AlertLevel;
import com.aquainsight.domain.alert.types.AlertStatus;
import com.aquainsight.domain.alert.types.AlertTargetType;
import com.aquainsight.infrastructure.converter.AlertRecordConverter;
import com.aquainsight.infrastructure.db.dao.AlertRecordDao;
import com.aquainsight.infrastructure.db.model.AlertRecordPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 告警记录仓储实现
 */
@Repository
@RequiredArgsConstructor
public class AlertRecordRepositoryImpl implements AlertRecordRepository {

    private final AlertRecordDao alertRecordDao;
    private final AlertRecordConverter converter = AlertRecordConverter.INSTANCE;

    @Override
    public AlertRecord save(AlertRecord alertRecord) {
        AlertRecordPO po = converter.toPO(alertRecord);
        alertRecordDao.insert(po);
        return converter.toEntity(po);
    }

    @Override
    public Optional<AlertRecord> findById(Integer id) {
        AlertRecordPO po = alertRecordDao.selectById(id);
        return Optional.ofNullable(po).map(converter::toEntity);
    }

    @Override
    public List<AlertRecord> findAll() {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRecord> findByStatus(AlertStatus status) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getStatus, status.name());
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRecord> findByRuleId(Integer ruleId) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getRuleId, ruleId);
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRecord> findByTarget(AlertTargetType targetType, Integer targetId) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getTargetType, targetType.getCode());
        queryWrapper.eq(AlertRecordPO::getTargetId, targetId);
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRecord> findByAlertLevel(AlertLevel alertLevel) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getAlertLevel, alertLevel.name());
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRecord> findByJobInstanceId(Integer taskId) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getTargetType, AlertTargetType.TASK.getCode());
        queryWrapper.eq(AlertRecordPO::getTargetId, taskId);
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public AlertRecord update(AlertRecord alertRecord) {
        AlertRecordPO po = converter.toPO(alertRecord);
        alertRecordDao.updateById(po);
        return converter.toEntity(po);
    }

    @Override
    public boolean deleteById(Integer id) {
        return alertRecordDao.deleteById(id) > 0;
    }

    @Override
    public IPage<AlertRecord> findPage(Integer pageNum, Integer pageSize, AlertStatus status,
                                        AlertLevel alertLevel, AlertTargetType targetType,
                                        LocalDateTime startTime, LocalDateTime endTime) {
        Page<AlertRecordPO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();

        if (status != null) {
            queryWrapper.eq(AlertRecordPO::getStatus, status.name());
        }

        if (alertLevel != null) {
            queryWrapper.eq(AlertRecordPO::getAlertLevel, alertLevel.getCode());
        }

        if (targetType != null) {
            queryWrapper.eq(AlertRecordPO::getTargetType, targetType.getCode());
        }

        if (startTime != null) {
            queryWrapper.ge(AlertRecordPO::getCreateTime, startTime);
        }

        if (endTime != null) {
            queryWrapper.le(AlertRecordPO::getCreateTime, endTime);
        }

        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);

        IPage<AlertRecordPO> poPage = alertRecordDao.selectPage(page, queryWrapper);

        // 转换为实体分页对象
        Page<AlertRecord> entityPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        List<AlertRecord> entityList = poPage.getRecords().stream()
                .map(converter::toEntity)
                .collect(Collectors.toList());
        entityPage.setRecords(entityList);

        return entityPage;
    }

    @Override
    public Optional<AlertRecord> findLatestByRuleIdAndTimeRange(Integer ruleId, LocalDateTime startTime, LocalDateTime endTime) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getRuleId, ruleId);

        if (startTime != null) {
            queryWrapper.ge(AlertRecordPO::getCreateTime, startTime);
        }

        if (endTime != null) {
            queryWrapper.le(AlertRecordPO::getCreateTime, endTime);
        }

        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        queryWrapper.last("LIMIT 1");

        AlertRecordPO po = alertRecordDao.selectOne(queryWrapper);
        return Optional.ofNullable(po).map(converter::toEntity);
    }

    @Override
    public long countByStatus(AlertStatus status) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getStatus, status.name());
        return alertRecordDao.selectCount(queryWrapper);
    }

    @Override
    public long countByAlertLevel(AlertLevel alertLevel) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getAlertLevel, alertLevel.name());
        return alertRecordDao.selectCount(queryWrapper);
    }

    @Override
    public List<AlertRecord> findPendingUrgentAlerts() {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertRecordPO::getStatus, AlertStatus.PENDING.name());
        queryWrapper.in(AlertRecordPO::getAlertLevel, AlertLevel.URGENT.name(), AlertLevel.IMPORTANT.name());
        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertRecord> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        LambdaQueryWrapper<AlertRecordPO> queryWrapper = new LambdaQueryWrapper<>();

        if (startTime != null) {
            queryWrapper.ge(AlertRecordPO::getCreateTime, startTime);
        }

        if (endTime != null) {
            queryWrapper.le(AlertRecordPO::getCreateTime, endTime);
        }

        queryWrapper.orderByDesc(AlertRecordPO::getCreateTime);
        List<AlertRecordPO> poList = alertRecordDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }
}
