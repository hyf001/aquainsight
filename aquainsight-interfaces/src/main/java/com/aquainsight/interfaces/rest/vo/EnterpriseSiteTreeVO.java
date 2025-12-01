package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 企业-站点树形结构视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseSiteTreeVO {

    /**
     * 企业ID
     */
    private Integer enterpriseId;

    /**
     * 企业名称
     */
    private String enterpriseName;

    /**
     * 企业编码
     */
    private String enterpriseCode;

    /**
     * 企业标签
     */
    private String enterpriseTag;

    /**
     * 该企业下的站点列表
     */
    private List<SiteVO> sites;

    /**
     * 站点数量
     */
    private Integer siteCount;
}
