package com.aquainsight.infrastructure.db.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 站点持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("site")
public class SitePO {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String siteCode;

    private String siteName;

    private String siteType;

    private String siteTag;

    private BigDecimal longitude;

    private BigDecimal latitude;

    private String address;

    private String enterpriseName;

    private Integer isAutoUpload;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
