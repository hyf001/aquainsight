package com.aquainsight.domain.maintenance.types;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 参数值
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParameterValue {

    /**
     * 参数名称
     */
    private String name;

    /**
     * 参数标签（快照）
     */
    private String label;

    /**
     * 参数类型（快照）
     */
    private ParameterType type;

    /**
     * 参数值
     * - TEXT/SELECT/RADIO: 字符串
     * - CHECKBOX: 存储为数组
     * - IMAGE: 图片URL或ID
     */
    private Object value;

    /**
     * 显示值（用于前端展示）
     */
    private String displayValue;

    /**
     * 填写时间
     */
    private LocalDateTime fillTime;
}
