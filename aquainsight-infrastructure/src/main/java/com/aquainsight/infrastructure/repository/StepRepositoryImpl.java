package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.Step;
import com.aquainsight.domain.maintenance.repository.StepRepository;
import com.aquainsight.infrastructure.converter.StepConverter;
import com.aquainsight.infrastructure.db.dao.StepDao;
import com.aquainsight.infrastructure.db.model.StepPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 步骤执行仓储实现
 */
@Repository
@RequiredArgsConstructor
public class StepRepositoryImpl implements StepRepository {

    private final StepDao stepDao;

    @Override
    public Step save(Step step) {
        StepPO stepPO = StepConverter.INSTANCE.toPO(step);
        if (step.getId() == null) {
            stepDao.insert(stepPO);
        } else {
            stepDao.updateById(stepPO);
        }
        return StepConverter.INSTANCE.toEntity(stepPO);
    }

    @Override
    public void saveBatch(List<Step> steps) {
        if (steps == null || steps.isEmpty()) {
            return;
        }
        List<StepPO> stepPOList = StepConverter.INSTANCE.toPOList(steps);
        for (StepPO stepPO : stepPOList) {
            if (stepPO.getId() == null) {
                stepDao.insert(stepPO);
            } else {
                stepDao.updateById(stepPO);
            }
        }
    }

    @Override
    public Step findById(Integer id) {
        StepPO stepPO = stepDao.selectById(id);
        if (stepPO == null) {
            return null;
        }
        return StepConverter.INSTANCE.toEntity(stepPO);
    }

    @Override
    public List<Step> findByTaskId(Integer taskId) {
        List<StepPO> stepPOList = stepDao.selectByTaskId(taskId);
        return StepConverter.INSTANCE.toEntityList(stepPOList);
    }

    @Override
    public Step findByTaskIdAndStepTemplateId(Integer taskId, Integer stepTemplateId) {
        StepPO stepPO = stepDao.selectByTaskIdAndStepTemplateId(taskId, stepTemplateId);
        if (stepPO == null) {
            return null;
        }
        return StepConverter.INSTANCE.toEntity(stepPO);
    }

    @Override
    public void deleteById(Integer id) {
        stepDao.deleteById(id);
    }

    @Override
    public void deleteByTaskId(Integer taskId) {
        LambdaQueryWrapper<StepPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StepPO::getTaskId, taskId);
        stepDao.delete(wrapper);
    }
}
