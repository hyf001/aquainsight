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
        if (factorPO == null) {
            return Optional.empty();
        }
        // MapStruct 自动处理嵌套的 deviceModel 转换
        return Optional.of(FactorConverter.INSTANCE.toEntity(factorPO));
    }

    @Override
    public List<Factor> findByCategory(String category) {
        LambdaQueryWrapper<FactorPO> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(FactorPO::getCategory,category);
        List<FactorPO> factorPOList = factorDao.selectList(lambdaQueryWrapper);
        // MapStruct 自动处理嵌套的 deviceModel 转换
        return FactorConverter.INSTANCE.toEntityList(factorPOList);
    }

    @Override
    public Factor update(Factor factor) {
        FactorPO factorPO = FactorConverter.INSTANCE.toPO(factor);
        factorDao.updateById(factorPO);
        // 重新查询以获取完整的关联对象
        return findById(factor.getId()).orElse(factor);
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
    public IPage<Factor> findPage(Integer pageNum, Integer pageSize, String category) {
        Page<FactorPO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<FactorPO> wrapper = new LambdaQueryWrapper<>();

        if (category != null && !category.trim().isEmpty()) {
            wrapper.eq(FactorPO::getCategory, category);
        }

        IPage<FactorPO> poPage = factorDao.selectPage(page, wrapper);
        Page<Factor> factorPage = new Page<>(poPage.getCurrent(), poPage.getSize(), poPage.getTotal());
        factorPage.setRecords(FactorConverter.INSTANCE.toEntityList(poPage.getRecords()));
        return factorPage;
    }

    @Override
    public List<Factor> findAll() {
        List<FactorPO> factorPOList = factorDao.selectList(null);
        return FactorConverter.INSTANCE.toEntityList(factorPOList);
    }
}
