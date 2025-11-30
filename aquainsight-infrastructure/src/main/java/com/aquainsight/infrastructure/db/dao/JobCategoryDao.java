package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.JobCategoryPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 作业类别DAO
 */
@Mapper
public interface JobCategoryDao extends BaseMapper<JobCategoryPO> {
}
