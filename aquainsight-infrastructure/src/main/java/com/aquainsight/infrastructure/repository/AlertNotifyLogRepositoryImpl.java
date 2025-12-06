package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.alert.entity.AlertNotifyLog;
import com.aquainsight.domain.alert.repository.AlertNotifyLogRepository;
import com.aquainsight.domain.alert.types.NotifyStatus;
import com.aquainsight.domain.alert.types.NotifyType;
import com.aquainsight.infrastructure.converter.AlertNotifyLogConverter;
import com.aquainsight.infrastructure.db.dao.AlertNotifyLogDao;
import com.aquainsight.infrastructure.db.model.AlertNotifyLogPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 告警通知日志仓储实现
 */
@Repository
@RequiredArgsConstructor
public class AlertNotifyLogRepositoryImpl implements AlertNotifyLogRepository {

    private final AlertNotifyLogDao alertNotifyLogDao;
    private final AlertNotifyLogConverter converter = AlertNotifyLogConverter.INSTANCE;

    @Override
    public AlertNotifyLog save(AlertNotifyLog notifyLog) {
        AlertNotifyLogPO po = converter.toPO(notifyLog);
        alertNotifyLogDao.insert(po);
        return converter.toEntity(po);
    }

    @Override
    public Optional<AlertNotifyLog> findById(Integer id) {
        AlertNotifyLogPO po = alertNotifyLogDao.selectById(id);
        return Optional.ofNullable(po).map(converter::toEntity);
    }

    @Override
    public List<AlertNotifyLog> findByAlertRecordId(Integer alertRecordId) {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getAlertRecordId, alertRecordId);
        queryWrapper.orderByDesc(AlertNotifyLogPO::getCreateTime);
        List<AlertNotifyLogPO> poList = alertNotifyLogDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertNotifyLog> findByNotifyStatus(NotifyStatus notifyStatus) {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getStatus, notifyStatus.name());
        queryWrapper.orderByDesc(AlertNotifyLogPO::getCreateTime);
        List<AlertNotifyLogPO> poList = alertNotifyLogDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertNotifyLog> findByNotifyType(NotifyType notifyType) {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getNotifyType, notifyType.getCode());
        queryWrapper.orderByDesc(AlertNotifyLogPO::getCreateTime);
        List<AlertNotifyLogPO> poList = alertNotifyLogDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertNotifyLog> findByNotifyUserId(Integer userId) {
        // Note: AlertNotifyLogPO doesn't have notifyUserId field
        // This would require extending the PO or using a different approach
        // For now, returning empty list as the PO structure doesn't support this
        return new ArrayList();
    }

    @Override
    public List<AlertNotifyLog> findPendingNotifyLogs() {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getStatus, NotifyStatus.PENDING.name());
        queryWrapper.orderByAsc(AlertNotifyLogPO::getCreateTime);
        List<AlertNotifyLogPO> poList = alertNotifyLogDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public List<AlertNotifyLog> findFailedAndRetryableNotifyLogs() {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getStatus, NotifyStatus.FAILED.name());
        // 重试次数小于3次的可以重试
        queryWrapper.lt(AlertNotifyLogPO::getRetryCount, 3);
        queryWrapper.orderByAsc(AlertNotifyLogPO::getCreateTime);
        List<AlertNotifyLogPO> poList = alertNotifyLogDao.selectList(queryWrapper);
        return converter.toEntityList(poList);
    }

    @Override
    public AlertNotifyLog update(AlertNotifyLog notifyLog) {
        AlertNotifyLogPO po = converter.toPO(notifyLog);
        alertNotifyLogDao.updateById(po);
        return converter.toEntity(po);
    }

    @Override
    public boolean deleteById(Integer id) {
        return alertNotifyLogDao.deleteById(id) > 0;
    }

    @Override
    public IPage<AlertNotifyLog> findPage(Integer pageNum, Integer pageSize, Integer alertRecordId,
                                           NotifyStatus notifyStatus, NotifyType notifyType,
                                           LocalDateTime startTime, LocalDateTime endTime) {
        Page<AlertNotifyLogPO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();

        if (alertRecordId != null) {
            queryWrapper.eq(AlertNotifyLogPO::getAlertRecordId, alertRecordId);
        }

        if (notifyStatus != null) {
            queryWrapper.eq(AlertNotifyLogPO::getStatus, notifyStatus.name());
        }

        if (notifyType != null) {
            queryWrapper.eq(AlertNotifyLogPO::getNotifyType, notifyType.getCode());
        }

        if (startTime != null) {
            queryWrapper.ge(AlertNotifyLogPO::getCreateTime, startTime);
        }

        if (endTime != null) {
            queryWrapper.le(AlertNotifyLogPO::getCreateTime, endTime);
        }

        queryWrapper.orderByDesc(AlertNotifyLogPO::getCreateTime);

        IPage<AlertNotifyLogPO> poPage = alertNotifyLogDao.selectPage(page, queryWrapper);

        // 转换为实体分页对象
        Page<AlertNotifyLog> entityPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        List<AlertNotifyLog> entityList = poPage.getRecords().stream()
                .map(converter::toEntity)
                .collect(Collectors.toList());
        entityPage.setRecords(entityList);

        return entityPage;
    }

    @Override
    public long countSuccessByAlertRecordId(Integer alertRecordId) {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getAlertRecordId, alertRecordId);
        queryWrapper.eq(AlertNotifyLogPO::getStatus, NotifyStatus.SUCCESS.name());
        return alertNotifyLogDao.selectCount(queryWrapper);
    }

    @Override
    public long countFailedByAlertRecordId(Integer alertRecordId) {
        LambdaQueryWrapper<AlertNotifyLogPO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AlertNotifyLogPO::getAlertRecordId, alertRecordId);
        queryWrapper.eq(AlertNotifyLogPO::getStatus, NotifyStatus.FAILED.name());
        return alertNotifyLogDao.selectCount(queryWrapper);
    }

    @Override
    public List<AlertNotifyLog> batchSave(List<AlertNotifyLog> notifyLogs) {
        List<AlertNotifyLogPO> poList = converter.toPOList(notifyLogs);
        // 批量插入
        for (AlertNotifyLogPO po : poList) {
            alertNotifyLogDao.insert(po);
        }
        return converter.toEntityList(poList);
    }
}
