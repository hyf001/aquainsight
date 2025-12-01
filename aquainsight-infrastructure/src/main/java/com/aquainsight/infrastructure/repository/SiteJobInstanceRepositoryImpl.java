package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import com.aquainsight.infrastructure.converter.SiteJobInstanceConverter;
import com.aquainsight.infrastructure.db.dao.SiteJobInstanceDao;
import com.aquainsight.infrastructure.db.model.SiteJobInstancePO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 站点任务实例仓储实现
 */
@Repository
@RequiredArgsConstructor
public class SiteJobInstanceRepositoryImpl implements SiteJobInstanceRepository {

    private final SiteJobInstanceDao siteJobInstanceDao;

    @Override
    public SiteJobInstance save(SiteJobInstance siteJobInstance) {
        SiteJobInstancePO siteJobInstancePO = SiteJobInstanceConverter.INSTANCE.toPO(siteJobInstance);
        if (siteJobInstance.getId() == null) {
            siteJobInstanceDao.insert(siteJobInstancePO);
        } else {
            siteJobInstanceDao.updateById(siteJobInstancePO);
        }
        return SiteJobInstanceConverter.INSTANCE.toEntity(siteJobInstancePO);
    }

    @Override
    public SiteJobInstance findById(Integer id) {
        SiteJobInstancePO siteJobInstancePO = siteJobInstanceDao.selectById(id);
        if (siteJobInstancePO == null) {
            return null;
        }
        return SiteJobInstanceConverter.INSTANCE.toEntity(siteJobInstancePO);
    }

    @Override
    public List<SiteJobInstance> findBySiteJobPlanId(Integer siteJobPlanId) {
        LambdaQueryWrapper<SiteJobInstancePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SiteJobInstancePO::getSiteJobPlanId, siteJobPlanId);
        wrapper.orderByDesc(SiteJobInstancePO::getTriggerTime);
        List<SiteJobInstancePO> siteJobInstancePOList = siteJobInstanceDao.selectList(wrapper);
        return SiteJobInstanceConverter.INSTANCE.toEntityList(siteJobInstancePOList);
    }

    @Override
    public List<SiteJobInstance> findByStatus(JobInstanceStatus status) {
        LambdaQueryWrapper<SiteJobInstancePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SiteJobInstancePO::getStatus, status.name());
        wrapper.orderByDesc(SiteJobInstancePO::getTriggerTime);
        List<SiteJobInstancePO> siteJobInstancePOList = siteJobInstanceDao.selectList(wrapper);
        return SiteJobInstanceConverter.INSTANCE.toEntityList(siteJobInstancePOList);
    }

    @Override
    public List<SiteJobInstance> findByOperator(String operator) {
        LambdaQueryWrapper<SiteJobInstancePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SiteJobInstancePO::getOperator, operator);
        wrapper.orderByDesc(SiteJobInstancePO::getTriggerTime);
        List<SiteJobInstancePO> siteJobInstancePOList = siteJobInstanceDao.selectList(wrapper);
        return SiteJobInstanceConverter.INSTANCE.toEntityList(siteJobInstancePOList);
    }

    @Override
    public List<SiteJobInstance> findOverdueInstances(LocalDateTime currentTime) {
        LambdaQueryWrapper<SiteJobInstancePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.le(SiteJobInstancePO::getExpiredTime, currentTime);
        wrapper.in(SiteJobInstancePO::getStatus, JobInstanceStatus.PENDING.name(), JobInstanceStatus.IN_PROGRESS.name());
        List<SiteJobInstancePO> siteJobInstancePOList = siteJobInstanceDao.selectList(wrapper);
        return SiteJobInstanceConverter.INSTANCE.toEntityList(siteJobInstancePOList);
    }

    @Override
    public List<SiteJobInstance> findBySiteId(Integer siteId) {
        // 需要关联查询，暂时返回空列表
        // TODO: 实现关联查询
        return new java.util.ArrayList<>();
    }

    @Override
    public List<SiteJobInstance> findByTriggerTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        LambdaQueryWrapper<SiteJobInstancePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.between(SiteJobInstancePO::getTriggerTime, startTime, endTime);
        wrapper.orderByDesc(SiteJobInstancePO::getTriggerTime);
        List<SiteJobInstancePO> siteJobInstancePOList = siteJobInstanceDao.selectList(wrapper);
        return SiteJobInstanceConverter.INSTANCE.toEntityList(siteJobInstancePOList);
    }

    @Override
    public void deleteById(Integer id) {
        siteJobInstanceDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        siteJobInstanceDao.deleteBatchIds(ids);
    }

    @Override
    public SiteJobInstance findByIdWithPlan(Integer id) {
        // TODO: 实现包含计划详情的查询
        return findById(id);
    }

    @Override
    public List<SiteJobInstance> findPendingInstances() {
        return findByStatus(JobInstanceStatus.PENDING);
    }

    @Override
    public List<SiteJobInstance> findInProgressInstances() {
        return findByStatus(JobInstanceStatus.IN_PROGRESS);
    }

    @Override
    public SiteJobInstance findBySiteJobPlanIdAndTriggerTime(Integer siteJobPlanId, LocalDateTime triggerTime) {
        LambdaQueryWrapper<SiteJobInstancePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SiteJobInstancePO::getSiteJobPlanId, siteJobPlanId);
        wrapper.eq(SiteJobInstancePO::getTriggerTime, triggerTime);
        SiteJobInstancePO siteJobInstancePO = siteJobInstanceDao.selectOne(wrapper);
        if (siteJobInstancePO == null) {
            return null;
        }
        return SiteJobInstanceConverter.INSTANCE.toEntity(siteJobInstancePO);
    }

    @Override
    public com.baomidou.mybatisplus.core.metadata.IPage<SiteJobInstance> findPageWithDetails(
            Integer pageNum, Integer pageSize,
            String siteName, String status, LocalDateTime startTime, LocalDateTime endTime,
            String creator, Integer departmentId) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<SiteJobInstancePO> page =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNum, pageSize);
        com.baomidou.mybatisplus.core.metadata.IPage<SiteJobInstancePO> poPage =
                siteJobInstanceDao.selectPageWithDetails(page, siteName, status, startTime, endTime, creator, departmentId);

        com.baomidou.mybatisplus.extension.plugins.pagination.Page<SiteJobInstance> siteJobInstancePage =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        siteJobInstancePage.setRecords(SiteJobInstanceConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return siteJobInstancePage;
    }
}
