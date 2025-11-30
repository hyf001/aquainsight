package com.aquainsight.application.service;

import com.aquainsight.domain.monitoring.entity.Enterprise;
import com.aquainsight.domain.monitoring.repository.EnterpriseRepository;
import com.aquainsight.domain.monitoring.repository.SiteRepository;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 企业应用服务
 */
@Service
@RequiredArgsConstructor
public class EnterpriseApplicationService {

    private final EnterpriseRepository enterpriseRepository;
    private final SiteRepository siteRepository;

    /**
     * 创建企业
     */
    @Transactional(rollbackFor = Exception.class)
    public Enterprise createEnterprise(String enterpriseName, String enterpriseCode,
                                      String enterpriseTag, String contactPerson,
                                      String contactPhone, String address, String description) {
        // 检查企业编码是否已存在
        if (enterpriseRepository.existsByEnterpriseCode(enterpriseCode)) {
            throw new RuntimeException("企业编码已存在");
        }

        Enterprise enterprise = Enterprise.builder()
                .enterpriseName(enterpriseName)
                .enterpriseCode(enterpriseCode)
                .enterpriseTag(enterpriseTag)
                .contactPerson(contactPerson)
                .contactPhone(contactPhone)
                .address(address)
                .description(description)
                .build();

        // 验证企业编码
        if (!enterprise.isValidEnterpriseCode()) {
            throw new RuntimeException("企业编码格式不正确,应为18位统一社会信用代码");
        }

        return enterpriseRepository.save(enterprise);
    }

    /**
     * 更新企业信息
     */
    @Transactional(rollbackFor = Exception.class)
    public Enterprise updateEnterpriseInfo(Integer id, String enterpriseName,
                                          String enterpriseTag, String contactPerson,
                                          String contactPhone, String address, String description) {
        Optional<Enterprise> enterpriseOpt = enterpriseRepository.findById(id);
        if (!enterpriseOpt.isPresent()) {
            throw new RuntimeException("企业不存在");
        }

        Enterprise enterprise = enterpriseOpt.get();
        enterprise.updateInfo(enterpriseName, enterpriseTag, contactPerson, contactPhone, address, description);
        return enterpriseRepository.update(enterprise);
    }

    /**
     * 根据ID获取企业
     */
    public Optional<Enterprise> getEnterpriseById(Integer id) {
        return enterpriseRepository.findById(id);
    }

    /**
     * 根据企业编码获取企业
     */
    public Optional<Enterprise> getEnterpriseByCode(String enterpriseCode) {
        return enterpriseRepository.findByEnterpriseCode(enterpriseCode);
    }

    /**
     * 获取所有企业
     */
    public List<Enterprise> getAllEnterprises() {
        return enterpriseRepository.findAll();
    }

    /**
     * 根据企业标签获取企业列表
     */
    public List<Enterprise> getEnterprisesByTag(String enterpriseTag) {
        return enterpriseRepository.findByEnterpriseTag(enterpriseTag);
    }

    /**
     * 分页查询企业
     */
    public IPage<Enterprise> getEnterprisePage(Integer pageNum, Integer pageSize,
                                               String enterpriseName, String enterpriseTag) {
        return enterpriseRepository.findPage(pageNum, pageSize, enterpriseName, enterpriseTag);
    }

    /**
     * 删除企业
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteEnterprise(Integer id) {
        // 检查企业下是否有站点
        List<com.aquainsight.domain.monitoring.entity.Site> sites = siteRepository.findByEnterpriseId(id);

        if (sites.size() > 0) {
            throw new RuntimeException("该企业下还有" + sites.size() + "个站点,无法删除");
        }

        enterpriseRepository.deleteById(id);
    }

    /**
     * 获取企业的站点数量
     */
    public long countEnterpriseSites(Integer enterpriseId) {
        List<com.aquainsight.domain.monitoring.entity.Site> sites = siteRepository.findByEnterpriseId(enterpriseId);
        return sites.size();
    }
}
