package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.infrastructure.db.model.SitePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 站点转换器
 * 使用 MapStruct 嵌套映射简化转换
 */
@Mapper(uses = EnterpriseConverter.class)
public interface SiteConverter {

    SiteConverter INSTANCE = Mappers.getMapper(SiteConverter.class);

    /**
     * PO转Entity (自动使用 EnterpriseConverter 转换 enterprise 字段)
     */
    Site toEntity(SitePO sitePO);

    /**
     * Entity转PO (从Enterprise对象提取ID，不转换enterprise字段)
     */
    @Mapping(target = "enterpriseId", expression = "java(site.getEnterprise() != null ? site.getEnterprise().getId() : null)")
    @Mapping(target = "enterprise", ignore = true)
    SitePO toPO(Site site);

    /**
     * PO列表转Entity列表 (自动使用 EnterpriseConverter 转换 enterprise 字段)
     */
    List<Site> toEntityList(List<SitePO> sitePOList);

    /**
     * Entity列表转PO列表
     */
    List<SitePO> toPOList(List<Site> siteList);
}
