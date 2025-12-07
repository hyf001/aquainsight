package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.repository.SchemeRepository;
import com.aquainsight.infrastructure.converter.SchemeConverter;
import com.aquainsight.infrastructure.converter.SchemeItemConverter;
import com.aquainsight.infrastructure.db.dao.SchemeDao;
import com.aquainsight.infrastructure.db.dao.SchemeItemDao;
import com.aquainsight.infrastructure.db.model.SchemePO;
import com.aquainsight.infrastructure.db.model.SchemeItemPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 方案仓储实现
 */
@Repository
@RequiredArgsConstructor
public class SchemeRepositoryImpl implements SchemeRepository {

    private final SchemeDao schemeDao;
    private final SchemeItemDao schemeItemDao;

    @Override
    public Scheme save(Scheme scheme) {
        SchemePO schemePO = SchemeConverter.INSTANCE.toPO(scheme);
        if (scheme.getId() == null) {
            schemeDao.insert(schemePO);
        } else {
            schemeDao.updateById(schemePO);
        }
        return SchemeConverter.INSTANCE.toEntity(schemePO);
    }

    @Override
    public Scheme findById(Integer id) {
        SchemePO schemePO = schemeDao.selectById(id);
        if (schemePO == null) {
            return null;
        }
        return SchemeConverter.INSTANCE.toEntity(schemePO);
    }

    @Override
    public Scheme findByCode(String code) {
        LambdaQueryWrapper<SchemePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SchemePO::getCode, code);
        SchemePO schemePO = schemeDao.selectOne(wrapper);
        if (schemePO == null) {
            return null;
        }
        return SchemeConverter.INSTANCE.toEntity(schemePO);
    }

    @Override
    public List<Scheme> findAll() {
        List<SchemePO> schemePOList = schemeDao.selectList(null);
        return SchemeConverter.INSTANCE.toEntityList(schemePOList);
    }

    @Override
    public List<Scheme> findByNameLike(String name) {
        LambdaQueryWrapper<SchemePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(SchemePO::getName, name);
        List<SchemePO> schemePOList = schemeDao.selectList(wrapper);
        return SchemeConverter.INSTANCE.toEntityList(schemePOList);
    }

    @Override
    public void deleteById(Integer id) {
        schemeDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        schemeDao.deleteBatchIds(ids);
    }

    @Override
    public Scheme findByIdWithItems(Integer id) {
        // 使用包含方案项的查询方法
        SchemePO schemePO = schemeDao.selectByIdWithItems(id);
        if (schemePO == null) {
            return null;
        }
        return SchemeConverter.INSTANCE.toEntity(schemePO);
    }
}
