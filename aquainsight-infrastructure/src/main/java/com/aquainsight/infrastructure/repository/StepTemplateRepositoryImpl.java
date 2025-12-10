package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.StepTemplate;
import com.aquainsight.domain.maintenance.repository.StepTemplateRepository;
import com.aquainsight.infrastructure.converter.StepTemplateConverter;
import com.aquainsight.infrastructure.db.dao.StepTemplateDao;
import com.aquainsight.infrastructure.db.model.StepTemplatePO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 步骤模版仓储实现
 */
@Repository
@RequiredArgsConstructor
public class StepTemplateRepositoryImpl implements StepTemplateRepository {

    private final StepTemplateDao stepTemplateDao;

    @Override
    public StepTemplate save(StepTemplate stepTemplate) {
        StepTemplatePO stepTemplatePO = StepTemplateConverter.INSTANCE.toPO(stepTemplate);
        if (stepTemplate.getId() == null) {
            stepTemplateDao.insert(stepTemplatePO);
        } else {
            stepTemplateDao.updateById(stepTemplatePO);
        }
        return StepTemplateConverter.INSTANCE.toEntity(stepTemplatePO);
    }

    @Override
    public StepTemplate findById(Integer id) {
        StepTemplatePO stepTemplatePO = stepTemplateDao.selectById(id);
        if (stepTemplatePO == null) {
            return null;
        }
        return StepTemplateConverter.INSTANCE.toEntity(stepTemplatePO);
    }

    @Override
    public StepTemplate findByCode(String code) {
        LambdaQueryWrapper<StepTemplatePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StepTemplatePO::getCode, code);
        StepTemplatePO stepTemplatePO = stepTemplateDao.selectOne(wrapper);
        if (stepTemplatePO == null) {
            return null;
        }
        return StepTemplateConverter.INSTANCE.toEntity(stepTemplatePO);
    }

    @Override
    public List<StepTemplate> findAll() {
        List<StepTemplatePO> stepTemplatePOList = stepTemplateDao.selectList(null);
        return StepTemplateConverter.INSTANCE.toEntityList(stepTemplatePOList);
    }

    @Override
    public List<StepTemplate> findByNameLike(String name) {
        LambdaQueryWrapper<StepTemplatePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StepTemplatePO::getName, name);
        List<StepTemplatePO> stepTemplatePOList = stepTemplateDao.selectList(wrapper);
        return StepTemplateConverter.INSTANCE.toEntityList(stepTemplatePOList);
    }

    @Override
    public void deleteById(Integer id) {
        stepTemplateDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        stepTemplateDao.deleteBatchIds(ids);
    }
}
