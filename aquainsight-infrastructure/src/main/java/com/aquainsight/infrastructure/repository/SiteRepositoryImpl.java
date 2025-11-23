package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.aquainsight.infrastructure.converter.SiteConverter;
import com.aquainsight.infrastructure.db.dao.SiteDao;
import com.aquainsight.infrastructure.db.model.SitePO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 站点仓储实现
 */
@Repository
@RequiredArgsConstructor
public class SiteRepositoryImpl implements SiteRepository {

    private final SiteDao siteDao;

    @Override
    public Site save(Site site) {
        SitePO sitePO = SiteConverter.INSTANCE.toPO(site);
        siteDao.insert(sitePO);
        return SiteConverter.INSTANCE.toEntity(sitePO);
    }

    @Override
    public Optional<Site> findById(Integer id) {
        SitePO sitePO = siteDao.selectById(id);
        return Optional.ofNullable(sitePO).map(SiteConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<Site> findBySiteCode(String siteCode) {
        LambdaQueryWrapper<SitePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SitePO::getSiteCode, siteCode);
        SitePO sitePO = siteDao.selectOne(wrapper);
        return Optional.ofNullable(sitePO).map(SiteConverter.INSTANCE::toEntity);
    }

    @Override
    public List<Site> findAll() {
        List<SitePO> sitePOList = siteDao.selectList(null);
        return SiteConverter.INSTANCE.toEntityList(sitePOList);
    }

    @Override
    public List<Site> findBySiteType(String siteType) {
        LambdaQueryWrapper<SitePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SitePO::getSiteType, siteType);
        List<SitePO> sitePOList = siteDao.selectList(wrapper);
        return SiteConverter.INSTANCE.toEntityList(sitePOList);
    }

    @Override
    public List<Site> findByEnterpriseName(String enterpriseName) {
        LambdaQueryWrapper<SitePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SitePO::getEnterpriseName, enterpriseName);
        List<SitePO> sitePOList = siteDao.selectList(wrapper);
        return SiteConverter.INSTANCE.toEntityList(sitePOList);
    }

    @Override
    public Site update(Site site) {
        SitePO sitePO = SiteConverter.INSTANCE.toPO(site);
        siteDao.updateById(sitePO);
        return SiteConverter.INSTANCE.toEntity(sitePO);
    }

    @Override
    public boolean deleteById(Integer id) {
        return siteDao.deleteById(id) > 0;
    }

    @Override
    public boolean existsBySiteCode(String siteCode) {
        LambdaQueryWrapper<SitePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SitePO::getSiteCode, siteCode);
        return siteDao.selectCount(wrapper) > 0;
    }

    @Override
    public IPage<Site> findPage(Integer pageNum, Integer pageSize, String siteType, String enterpriseName) {
        Page<SitePO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SitePO> wrapper = new LambdaQueryWrapper<>();

        if (siteType != null && !siteType.trim().isEmpty()) {
            wrapper.eq(SitePO::getSiteType, siteType);
        }
        if (enterpriseName != null && !enterpriseName.trim().isEmpty()) {
            wrapper.like(SitePO::getEnterpriseName, enterpriseName);
        }

        IPage<SitePO> poPage = siteDao.selectPage(page, wrapper);
        Page<Site> sitePage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        sitePage.setRecords(SiteConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return sitePage;
    }
}
