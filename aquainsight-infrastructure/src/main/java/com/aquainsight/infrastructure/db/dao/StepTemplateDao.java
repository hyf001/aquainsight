package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.StepTemplatePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 步骤模版DAO
 */
@Mapper
public interface StepTemplateDao extends BaseMapper<StepTemplatePO> {
}
