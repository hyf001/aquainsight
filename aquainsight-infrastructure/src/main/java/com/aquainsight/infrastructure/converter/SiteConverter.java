package com.aquainsight.infrastructure.converter;

import com.aquainsight.domain.monitoring.entity.Site;
import com.aquainsight.infrastructure.db.model.SitePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 站点转换器
 */
@Mapper
public interface SiteConverter {

    SiteConverter INSTANCE = Mappers.getMapper(SiteConverter.class);

    /**
     * PO转Entity
     */
    Site toEntity(SitePO sitePO);

    /**
     * Entity转PO
     */
    SitePO toPO(Site site);

    /**
     * PO列表转Entity列表
     */
    List<Site> toEntityList(List<SitePO> sitePOList);

    /**
     * Entity列表转PO列表
     */
    List<SitePO> toPOList(List<Site> siteList);
}
