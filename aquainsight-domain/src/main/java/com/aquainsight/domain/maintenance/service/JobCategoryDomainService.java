package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.JobCategory;
import com.aquainsight.domain.maintenance.repository.JobCategoryRepository;
import com.aquainsight.domain.maintenance.types.JobParameter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 作业类别领域服务
 */
@Service
@RequiredArgsConstructor
public class JobCategoryDomainService {

    private final JobCategoryRepository jobCategoryRepository;

    /**
     * 创建作业类别
     */
    public JobCategory createJobCategory(String name, String code, List<JobParameter> parameters,
                                        Integer overdueDays, String description) {
        // 领域规则验证
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("类别名称不能为空");
        }
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("类别编码不能为空");
        }

        // 检查编码是否已存在
        JobCategory existingJobCategory = jobCategoryRepository.findByCode(code);
        if (existingJobCategory != null) {
            throw new IllegalArgumentException("类别编码已存在");
        }

        JobCategory jobCategory = JobCategory.builder()
                .name(name)
                .code(code)
                .parameters(parameters)
                .overdueDays(overdueDays == null ? 0 : overdueDays)
                .description(description)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return jobCategoryRepository.save(jobCategory);
    }

    /**
     * 更新作业类别信息
     */
    public JobCategory updateJobCategoryInfo(Integer jobCategoryId, String name, List<JobParameter> parameters,
                                            Integer overdueDays, String description) {
        JobCategory jobCategory = jobCategoryRepository.findById(jobCategoryId);
        if (jobCategory == null) {
            throw new IllegalArgumentException("作业类别不存在");
        }

        jobCategory.updateInfo(name, parameters, overdueDays, description);
        return jobCategoryRepository.save(jobCategory);
    }

    /**
     * 根据ID获取作业类别
     */
    public JobCategory getJobCategoryById(Integer jobCategoryId) {
        return jobCategoryRepository.findById(jobCategoryId);
    }

    /**
     * 根据编码获取作业类别
     */
    public JobCategory getJobCategoryByCode(String code) {
        return jobCategoryRepository.findByCode(code);
    }

    /**
     * 获取所有作业类别
     */
    public List<JobCategory> getAllJobCategories() {
        return jobCategoryRepository.findAll();
    }

    /**
     * 根据名称模糊查询
     */
    public List<JobCategory> searchJobCategoriesByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return jobCategoryRepository.findAll();
        }
        return jobCategoryRepository.findByNameLike(name);
    }

    /**
     * 删除作业类别
     */
    public void deleteJobCategory(Integer jobCategoryId) {
        JobCategory jobCategory = jobCategoryRepository.findById(jobCategoryId);
        if (jobCategory == null) {
            throw new IllegalArgumentException("作业类别不存在");
        }
        jobCategoryRepository.deleteById(jobCategoryId);
    }

    /**
     * 批量删除作业类别
     */
    public void deleteJobCategories(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        jobCategoryRepository.deleteByIds(ids);
    }
}
