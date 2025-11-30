package com.aquainsight.infrastructure.repository;

import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.repository.JobCategoryRepository;
import com.aquainsight.infrastructure.converter.JobCategoryConverter;
import com.aquainsight.infrastructure.db.dao.JobCategoryDao;
import com.aquainsight.infrastructure.db.model.JobCategoryPO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 作业类别仓储实现
 */
@Repository
@RequiredArgsConstructor
public class JobCategoryRepositoryImpl implements JobCategoryRepository {

    private final JobCategoryDao jobCategoryDao;

    @Override
    public JobCategory save(JobCategory jobCategory) {
        JobCategoryPO jobCategoryPO = JobCategoryConverter.INSTANCE.toPO(jobCategory);
        if (jobCategory.getId() == null) {
            jobCategoryDao.insert(jobCategoryPO);
        } else {
            jobCategoryDao.updateById(jobCategoryPO);
        }
        return JobCategoryConverter.INSTANCE.toEntity(jobCategoryPO);
    }

    @Override
    public JobCategory findById(Integer id) {
        JobCategoryPO jobCategoryPO = jobCategoryDao.selectById(id);
        if (jobCategoryPO == null) {
            return null;
        }
        return JobCategoryConverter.INSTANCE.toEntity(jobCategoryPO);
    }

    @Override
    public JobCategory findByCode(String code) {
        LambdaQueryWrapper<JobCategoryPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(JobCategoryPO::getCode, code);
        JobCategoryPO jobCategoryPO = jobCategoryDao.selectOne(wrapper);
        if (jobCategoryPO == null) {
            return null;
        }
        return JobCategoryConverter.INSTANCE.toEntity(jobCategoryPO);
    }

    @Override
    public List<JobCategory> findAll() {
        List<JobCategoryPO> jobCategoryPOList = jobCategoryDao.selectList(null);
        return JobCategoryConverter.INSTANCE.toEntityList(jobCategoryPOList);
    }

    @Override
    public List<JobCategory> findByNameLike(String name) {
        LambdaQueryWrapper<JobCategoryPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(JobCategoryPO::getName, name);
        List<JobCategoryPO> jobCategoryPOList = jobCategoryDao.selectList(wrapper);
        return JobCategoryConverter.INSTANCE.toEntityList(jobCategoryPOList);
    }

    @Override
    public void deleteById(Integer id) {
        jobCategoryDao.deleteById(id);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        jobCategoryDao.deleteBatchIds(ids);
    }
}
