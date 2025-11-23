package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.monitoring.entity.Factor;
import com.aquainsight.domain.monitoring.repository.FactorRepository;
import com.aquainsight.infrastructure.converter.FactorConverter;
import com.aquainsight.infrastructure.db.dao.FactorDao;
import com.aquainsight.infrastructure.db.model.FactorPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 监测因子仓储实现
 */
@Repository
@RequiredArgsConstructor
public class FactorRepositoryImpl implements FactorRepository {

    private final FactorDao factorDao;

    @Override
    public Factor save(Factor factor) {
        FactorPO factorPO = FactorConverter.INSTANCE.toPO(factor);
        factorDao.insert(factorPO);
        return FactorConverter.INSTANCE.toEntity(factorPO);
    }

    @Override
    public Optional<Factor> findById(Integer id) {
        FactorPO factorPO = factorDao.selectById(id);
        return Optional.ofNullable(factorPO).map(FactorConverter.INSTANCE::toEntity);
    }

    @Override
    public Optional<Factor> findByFactorCode(String factorCode) {
        LambdaQueryWrapper<FactorPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(FactorPO::getFactorCode, factorCode);
        FactorPO factorPO = factorDao.selectOne(wrapper);
        return Optional.ofNullable(factorPO).map(FactorConverter.INSTANCE::toEntity);
    }

    @Override
    public List<Factor> findAll() {
        List<FactorPO> factorPOList = factorDao.selectList(null);
        return FactorConverter.INSTANCE.toEntityList(factorPOList);
    }

    @Override
    public List<Factor> findByDeviceModelId(Integer deviceModelId) {
        LambdaQueryWrapper<FactorPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(FactorPO::getDeviceModelId, deviceModelId);
        List<FactorPO> factorPOList = factorDao.selectList(wrapper);
        return FactorConverter.INSTANCE.toEntityList(factorPOList);
    }

    @Override
    public List<Factor> findByCategory(String category) {
        LambdaQueryWrapper<FactorPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(FactorPO::getCategory, category);
        List<FactorPO> factorPOList = factorDao.selectList(wrapper);
        return FactorConverter.INSTANCE.toEntityList(factorPOList);
    }

    @Override
    public Factor update(Factor factor) {
        FactorPO factorPO = FactorConverter.INSTANCE.toPO(factor);
        factorDao.updateById(factorPO);
        return FactorConverter.INSTANCE.toEntity(factorPO);
    }

    @Override
    public boolean deleteById(Integer id) {
        return factorDao.deleteById(id) > 0;
    }

    @Override
    public boolean existsByFactorCode(String factorCode) {
        LambdaQueryWrapper<FactorPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(FactorPO::getFactorCode, factorCode);
        return factorDao.selectCount(wrapper) > 0;
    }

    @Override
    public IPage<Factor> findPage(Integer pageNum, Integer pageSize, String category, Integer deviceModelId) {
        Page<FactorPO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<FactorPO> wrapper = new LambdaQueryWrapper<>();

        if (category != null && !category.trim().isEmpty()) {
            wrapper.eq(FactorPO::getCategory, category);
        }
        if (deviceModelId != null) {
            wrapper.eq(FactorPO::getDeviceModelId, deviceModelId);
        }

        IPage<FactorPO> poPage = factorDao.selectPage(page, wrapper);
        Page<Factor> factorPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        factorPage.setRecords(FactorConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return factorPage;
    }
}
