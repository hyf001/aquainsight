package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.monitoring.entity.Enterprise;
import com.aquainsight.domain.monitoring.repository.EnterpriseRepository;
import com.aquainsight.infrastructure.converter.EnterpriseConverter;
import com.aquainsight.infrastructure.db.dao.EnterpriseDao;
import com.aquainsight.infrastructure.db.model.EnterprisePO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 企业仓储实现
 */
@Repository
@RequiredArgsConstructor
public class EnterpriseRepositoryImpl implements EnterpriseRepository {

    private final EnterpriseDao enterpriseDao;

    @Override
    public Enterprise save(Enterprise enterprise) {
        EnterprisePO enterprisePO = EnterpriseConverter.INSTANCE.toPO(enterprise);
        enterpriseDao.insert(enterprisePO);
        return EnterpriseConverter.INSTANCE.toEntity(enterprisePO);
    }

    @Override
    public Optional<Enterprise> findById(Integer id) {
        EnterprisePO enterprisePO = enterpriseDao.selectById(id);
        return Optional.ofNullable(enterprisePO).map(EnterpriseConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<Enterprise> findByEnterpriseCode(String enterpriseCode) {
        LambdaQueryWrapper<EnterprisePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(EnterprisePO::getEnterpriseCode, enterpriseCode);
        EnterprisePO enterprisePO = enterpriseDao.selectOne(wrapper);
        return Optional.ofNullable(enterprisePO).map(EnterpriseConverter.INSTANCE::toEntity);
    }

    @Override
    public List<Enterprise> findAll() {
        List<EnterprisePO> enterprisePOList = enterpriseDao.selectList(null);
        return enterprisePOList.stream()
                .map(EnterpriseConverter.INSTANCE::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Enterprise> findByEnterpriseTag(String enterpriseTag) {
        LambdaQueryWrapper<EnterprisePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(EnterprisePO::getEnterpriseTag, enterpriseTag);
        List<EnterprisePO> enterprisePOList = enterpriseDao.selectList(wrapper);
        return enterprisePOList.stream()
                .map(EnterpriseConverter.INSTANCE::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Enterprise update(Enterprise enterprise) {
        EnterprisePO enterprisePO = EnterpriseConverter.INSTANCE.toPO(enterprise);
        enterpriseDao.updateById(enterprisePO);
        return EnterpriseConverter.INSTANCE.toEntity(enterprisePO);
    }

    @Override
    public boolean deleteById(Integer id) {
        return enterpriseDao.deleteById(id) > 0;
    }

    @Override
    public boolean existsByEnterpriseCode(String enterpriseCode) {
        LambdaQueryWrapper<EnterprisePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(EnterprisePO::getEnterpriseCode, enterpriseCode);
        return enterpriseDao.selectCount(wrapper) > 0;
    }

    @Override
    public IPage<Enterprise> findPage(Integer pageNum, Integer pageSize, String enterpriseName, String enterpriseTag) {
        Page<EnterprisePO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<EnterprisePO> wrapper = new LambdaQueryWrapper<>();

        if (enterpriseName != null && !enterpriseName.trim().isEmpty()) {
            wrapper.like(EnterprisePO::getEnterpriseName, enterpriseName);
        }
        if (enterpriseTag != null && !enterpriseTag.trim().isEmpty()) {
            wrapper.eq(EnterprisePO::getEnterpriseTag, enterpriseTag);
        }

        IPage<EnterprisePO> poPage = enterpriseDao.selectPage(page, wrapper);
        Page<Enterprise> enterprisePage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        List<Enterprise> enterprises = poPage.getRecords().stream()
                .map(EnterpriseConverter.INSTANCE::toEntity)
                .collect(Collectors.toList());
        enterprisePage.setRecords(enterprises);
        return enterprisePage;
    }
}
