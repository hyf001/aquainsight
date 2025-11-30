package com.aquainsight.domain.monitoring.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 企业实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enterprise {

    /**
     * 企业ID
     */
    private Integer id;

    /**
     * 企业名称
     */
    private String enterpriseName;

    /**
     * 企业编码(统一社会信用编码)
     */
    private String enterpriseCode;

    /**
     * 企业标签
     */
    private String enterpriseTag;

    /**
     * 联系人
     */
    private String contactPerson;

    /**
     * 联系电话
     */
    private String contactPhone;

    /**
     * 企业地址
     */
    private String address;

    /**
     * 企业描述
     */
    private String description;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除(0-未删除,1-已删除)
     */
    private Integer deleted;

    /**
     * 更新企业信息
     */
    public void updateInfo(String enterpriseName, String enterpriseTag,
                          String contactPerson, String contactPhone,
                          String address, String description) {
        if (enterpriseName != null) {
            this.enterpriseName = enterpriseName;
        }
        if (enterpriseTag != null) {
            this.enterpriseTag = enterpriseTag;
        }
        if (contactPerson != null) {
            this.contactPerson = contactPerson;
        }
        if (contactPhone != null) {
            this.contactPhone = contactPhone;
        }
        if (address != null) {
            this.address = address;
        }
        if (description != null) {
            this.description = description;
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 验证企业编码是否有效
     * 统一社会信用代码为18位
     */
    public boolean isValidEnterpriseCode() {
        return enterpriseCode != null && enterpriseCode.length() == 18;
    }
}
