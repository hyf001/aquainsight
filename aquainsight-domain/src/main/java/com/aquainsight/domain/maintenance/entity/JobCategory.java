package com.aquainsight.domain.maintenance.entity;

import com.aquainsight.domain.maintenance.types.PhotoType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 作业类别实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCategory {

    /**
     * 作业类别ID
     */
    private Integer id;

    /**
     * 类别名称
     */
    private String name;

    /**
     * 类别编码
     */
    private String code;

    /**
     * 是否需要拍照(0-不需要,1-需要)
     */
    private Integer needPhoto;

    /**
     * 照片类型，多个之间逗号分隔
     */
    private String photoTypes;

    /**
     * 逾期天数
     */
    private Integer overdueDays;

    /**
     * 类别描述
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
     * 更新作业类别信息
     */
    public void updateInfo(String name, Integer needPhoto, String photoTypes,
                          Integer overdueDays, String description) {
        if (name != null) {
            this.name = name;
        }
        if (needPhoto != null) {
            this.needPhoto = needPhoto;
        }
        if (photoTypes != null) {
            this.photoTypes = photoTypes;
        }
        if (overdueDays != null) {
            this.overdueDays = overdueDays;
        }
        if (description != null) {
            this.description = description;
        }
        this.updateTime = LocalDateTime.now();
    }

    /**
     * 是否需要拍照
     */
    public boolean isPhotoRequired() {
        return Integer.valueOf(1).equals(this.needPhoto);
    }

    /**
     * 获取照片类型列表
     */
    public List<PhotoType> getPhotoTypeList() {
        if (photoTypes == null || photoTypes.trim().isEmpty()) {
            return Arrays.asList();
        }
        return Arrays.stream(photoTypes.split(","))
                .map(String::trim)
                .map(PhotoType::valueOf)
                .collect(Collectors.toList());
    }

    /**
     * 是否逾期
     */
    public boolean isOverdue(LocalDateTime lastMaintenanceTime) {
        if (lastMaintenanceTime == null || overdueDays == null || overdueDays == 0) {
            return false;
        }
        return LocalDateTime.now().isAfter(lastMaintenanceTime.plusDays(overdueDays));
    }
}
