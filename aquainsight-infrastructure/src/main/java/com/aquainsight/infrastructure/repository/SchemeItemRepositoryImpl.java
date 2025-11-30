package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.repository.SchemeItemRepository;
import com.aquainsight.infrastructure.converter.SchemeItemConverter;
import com.aquainsight.infrastructure.db.dao.SchemeItemDao;
import com.aquainsight.infrastructure.db.model.SchemeItemPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 方案项目仓储实现
 */
@Repository
@RequiredArgsConstructor
public class SchemeItemRepositoryImpl implements SchemeItemRepository {

    private final SchemeItemDao schemeItemDao;

    @Override
    public SchemeItem save(SchemeItem schemeItem) {
        SchemeItemPO schemeItemPO = SchemeItemConverter.INSTANCE.toPO(schemeItem);
        if (schemeItem.getId() == null) {
            schemeItemDao.insert(schemeItemPO);
        } else {
            schemeItemDao.updateById(schemeItemPO);
        }
        return SchemeItemConverter.INSTANCE.toEntity(schemeItemPO);
    }

    @Override
    public SchemeItem findById(Integer id) {
        SchemeItemPO schemeItemPO = schemeItemDao.selectById(id);
        if (schemeItemPO == null) {
            return null;
        }
        return SchemeItemConverter.INSTANCE.toEntity(schemeItemPO);
    }

    @Override
    public List<SchemeItem> findBySchemeId(Integer schemeId) {
        List<SchemeItemPO> schemeItemPOList = schemeItemDao.selectBySchemeIdWithJobCategory(schemeId);
        return SchemeItemConverter.INSTANCE.toEntityList(schemeItemPOList);
    }

    @Override
    public void deleteById(Integer id) {
        schemeItemDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        schemeItemDao.deleteBatchIds(ids);
    }

    @Override
    public void deleteBySchemeId(Integer schemeId) {
        LambdaQueryWrapper<SchemeItemPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SchemeItemPO::getSchemeId, schemeId);
        schemeItemDao.delete(wrapper);
    }
}
