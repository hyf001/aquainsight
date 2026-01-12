package com.aquainsight.infrastructure.db.dao;

import com.aquainsight.infrastructure.db.model.EnterprisePO;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 企业Mapper
 */
@Mapper
public interface EnterpriseDao extends BaseMapper<EnterprisePO> {

    /**
     * 分页查询企业并带上站点数量
     */
    @Select("SELECT e.*, (SELECT COUNT(*) FROM site s WHERE s.enterprise_id = e.id AND s.deleted = 0) as site_count " +
            "FROM enterprise e ${ew.customSqlSegment}")
    IPage<EnterprisePO> selectPageWithSiteCount(IPage<EnterprisePO> page, @Param(Constants.WRAPPER) Wrapper<EnterprisePO> queryWrapper);

    /**
     * 查询企业列表并带上站点数量
     */
    @Select("SELECT e.*, (SELECT COUNT(*) FROM site s WHERE s.enterprise_id = e.id AND s.deleted = 0) as site_count " +
            "FROM enterprise e ${ew.customSqlSegment}")
    List<EnterprisePO> selectListWithSiteCount(@Param(Constants.WRAPPER) Wrapper<EnterprisePO> queryWrapper);
}
