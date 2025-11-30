package com.aquainsight.domain.maintenance.repository;

import com.aquainsight.domain.maintenance.entity.JobCategory;

import java.util.List;

/**
 * 作业类别仓储接口
 */
public interface JobCategoryRepository {

    /**
     * 保存作业类别
     */
    JobCategory save(JobCategory jobCategory);

    /**
     * 根据ID查询作业类别
     */
    JobCategory findById(Integer id);

    /**
     * 根据编码查询作业类别
     */
    JobCategory findByCode(String code);

    /**
     * 查询所有作业类别
     */
    List<JobCategory> findAll();

    /**
     * 根据名称模糊查询
     */
    List<JobCategory> findByNameLike(String name);

    /**
     * 删除作业类别
     */
    void deleteById(Integer id);

    /**
     * 批量删除作业类别
     */
    void deleteByIds(List<Integer> ids);
}
