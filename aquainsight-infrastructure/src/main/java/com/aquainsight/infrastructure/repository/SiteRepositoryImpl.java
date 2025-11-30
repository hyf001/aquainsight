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
        SitePO sitePO = siteDao.selectByIdWithEnterprise(id);
        if (sitePO == null) {
            return Optional.empty();
        }
        return Optional.of(SiteConverter.INSTANCE.toEntity(sitePO));
    }

    @Override
    public Optional<Site> findBySiteCode(String siteCode) {
        SitePO sitePO = siteDao.selectBySiteCodeWithEnterprise(siteCode);
        if (sitePO == null) {
            return Optional.empty();
        }
        return Optional.of(SiteConverter.INSTANCE.toEntity(sitePO));
    }

    @Override
    public List<Site> findAll() {
        List<SitePO> sitePOList = siteDao.selectAllWithEnterprise();
        return SiteConverter.INSTANCE.toEntityList(sitePOList);
    }

    @Override
    public List<Site> findBySiteType(String siteType) {
        List<SitePO> sitePOList = siteDao.selectBySiteTypeWithEnterprise(siteType);
        return SiteConverter.INSTANCE.toEntityList(sitePOList);
    }

    @Override
    public List<Site> findByEnterpriseId(Integer enterpriseId) {
        List<SitePO> sitePOList = siteDao.selectByEnterpriseIdWithEnterprise(enterpriseId);
        return SiteConverter.INSTANCE.toEntityList(sitePOList);
    }

    @Override
    public Site update(Site site) {
        SitePO sitePO = SiteConverter.INSTANCE.toPO(site);
        siteDao.updateById(sitePO);
        return findById(site.getId()).orElse(site);
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
    public IPage<Site> findPage(Integer pageNum, Integer pageSize, String siteType, Integer enterpriseId) {
        Page<SitePO> page = new Page<>(pageNum, pageSize);
        // 使用带企业信息的分页查询
        IPage<SitePO> poPage = siteDao.selectPageWithEnterprise(page, siteType, enterpriseId);
        Page<Site> sitePage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        sitePage.setRecords(SiteConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return sitePage;
    }
}
