package com.aquainsight.domain.monitoring.service;

import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 站点领域服务
 */
@Service
@RequiredArgsConstructor
public class SiteDomainService {

    private final SiteRepository siteRepository;

    /**
     * 创建站点
     */
    public Site createSite(String siteCode, String siteName, String siteType, String siteTag,
                          BigDecimal longitude, BigDecimal latitude, String address,
                          String enterpriseName, Integer isAutoUpload) {
        // 领域规则验证
        if (siteCode == null || siteCode.trim().isEmpty()) {
            throw new IllegalArgumentException("站点编码不能为空");
        }
        if (siteName == null || siteName.trim().isEmpty()) {
            throw new IllegalArgumentException("站点名称不能为空");
        }
        if (siteRepository.existsBySiteCode(siteCode)) {
            throw new IllegalArgumentException("站点编码已存在");
        }

        Site site = Site.builder()
                .siteCode(siteCode)
                .siteName(siteName)
                .siteType(siteType)
                .siteTag(siteTag)
                .longitude(longitude)
                .latitude(latitude)
                .address(address)
                .enterpriseName(enterpriseName)
                .isAutoUpload(isAutoUpload == null ? 0 : isAutoUpload)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return siteRepository.save(site);
    }

    /**
     * 更新站点信息
     */
    public Site updateSiteInfo(Integer siteId, String siteName, String siteType, String siteTag,
                              BigDecimal longitude, BigDecimal latitude, String address,
                              String enterpriseName, Integer isAutoUpload) {
        Optional<Site> siteOpt = siteRepository.findById(siteId);
        if (!siteOpt.isPresent()) {
            throw new IllegalArgumentException("站点不存在");
        }

        Site site = siteOpt.get();
        site.updateInfo(siteName, siteType, siteTag, longitude, latitude, address, enterpriseName, isAutoUpload);
        return siteRepository.update(site);
    }

    /**
     * 根据ID获取站点
     */
    public Optional<Site> getSiteById(Integer siteId) {
        return siteRepository.findById(siteId);
    }

    /**
     * 根据站点编码获取站点
     */
    public Optional<Site> getSiteBySiteCode(String siteCode) {
        return siteRepository.findBySiteCode(siteCode);
    }

    /**
     * 获取所有站点
     */
    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }

    /**
     * 根据站点类型获取站点
     */
    public List<Site> getSitesBySiteType(String siteType) {
        return siteRepository.findBySiteType(siteType);
    }

    /**
     * 根据企业名称获取站点
     */
    public List<Site> getSitesByEnterpriseName(String enterpriseName) {
        return siteRepository.findByEnterpriseName(enterpriseName);
    }

    /**
     * 删除站点
     */
    public boolean deleteSite(Integer siteId) {
        Optional<Site> siteOpt = siteRepository.findById(siteId);
        if (!siteOpt.isPresent()) {
            throw new IllegalArgumentException("站点不存在");
        }
        return siteRepository.deleteById(siteId);
    }

    /**
     * 分页查询站点
     */
    public IPage<Site> getSitePage(Integer pageNum, Integer pageSize, String siteType, String enterpriseName) {
        return siteRepository.findPage(pageNum, pageSize, siteType, enterpriseName);
    }
}
