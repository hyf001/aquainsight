package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.SiteJobPlan;
import com.aquainsight.domain.maintenance.repository.SiteJobPlanRepository;
import com.aquainsight.infrastructure.converter.SiteJobPlanConverter;
import com.aquainsight.infrastructure.db.dao.SiteJobPlanDao;
import com.aquainsight.infrastructure.db.model.SiteJobPlanPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 站点任务计划仓储实现
 */
@Repository
@RequiredArgsConstructor
public class SiteJobPlanRepositoryImpl implements SiteJobPlanRepository {

    private final SiteJobPlanDao siteJobPlanDao;

    @Override
    public SiteJobPlan save(SiteJobPlan siteJobPlan) {
        SiteJobPlanPO siteJobPlanPO = SiteJobPlanConverter.INSTANCE.toPO(siteJobPlan);
        if (siteJobPlan.getId() == null) {
            siteJobPlanDao.insert(siteJobPlanPO);
        } else {
            siteJobPlanDao.updateById(siteJobPlanPO);
        }
        return SiteJobPlanConverter.INSTANCE.toEntity(siteJobPlanPO);
    }

    @Override
    public SiteJobPlan findById(Integer id) {
        SiteJobPlanPO siteJobPlanPO = siteJobPlanDao.selectById(id);
        if (siteJobPlanPO == null) {
            return null;
        }
        return SiteJobPlanConverter.INSTANCE.toEntity(siteJobPlanPO);
    }

    @Override
    public SiteJobPlan findBySiteId(Integer siteId) {
        LambdaQueryWrapper<SiteJobPlanPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SiteJobPlanPO::getSiteId, siteId);
        SiteJobPlanPO siteJobPlanPO = siteJobPlanDao.selectOne(wrapper);
        if (siteJobPlanPO == null) {
            return null;
        }
        return SiteJobPlanConverter.INSTANCE.toEntity(siteJobPlanPO);
    }

    @Override
    public SiteJobPlan findByIdWithDetails(Integer id) {
        SiteJobPlanPO siteJobPlanPO = siteJobPlanDao.selectByIdWithDetails(id);
        if (siteJobPlanPO == null) {
            return null;
        }
        return SiteJobPlanConverter.INSTANCE.toEntity(siteJobPlanPO);
    }

    @Override
    public SiteJobPlan findBySiteIdWithDetails(Integer siteId) {
        SiteJobPlanPO siteJobPlanPO = siteJobPlanDao.selectBySiteIdWithDetails(siteId);
        if (siteJobPlanPO == null) {
            return null;
        }
        return SiteJobPlanConverter.INSTANCE.toEntity(siteJobPlanPO);
    }

    @Override
    public List<SiteJobPlan> findAll() {
        List<SiteJobPlanPO> siteJobPlanPOList = siteJobPlanDao.selectList(null);
        return SiteJobPlanConverter.INSTANCE.toEntityList(siteJobPlanPOList);
    }

    @Override
    public void deleteById(Integer id) {
        siteJobPlanDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        siteJobPlanDao.deleteBatchIds(ids);
    }

    @Override
    public IPage<SiteJobPlan> findPageWithDetails(Integer pageNum, Integer pageSize,
                                                   String siteName, List<Integer> siteIds,
                                                   Integer departmentId) {
        Page<SiteJobPlanPO> page = new Page<>(pageNum, pageSize);
        IPage<SiteJobPlanPO> poPage = siteJobPlanDao.selectPageWithDetails(
                page, siteName, siteIds, departmentId);

        Page<SiteJobPlan> siteJobPlanPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        siteJobPlanPage.setRecords(SiteJobPlanConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return siteJobPlanPage;
    }

    @Override
    public List<SiteJobPlan> findActiveJobPlansWithDetails() {
        List<SiteJobPlanPO> siteJobPlanPOList = siteJobPlanDao.selectActiveJobPlansWithDetails();
        return SiteJobPlanConverter.INSTANCE.toEntityList(siteJobPlanPOList);
    }
}
