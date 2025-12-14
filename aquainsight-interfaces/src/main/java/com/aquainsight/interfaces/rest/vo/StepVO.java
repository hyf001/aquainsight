package com.aquainsight.interfaces.rest.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 步骤执行视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StepVO {

    /**
     * 步骤ID
     */
    private Integer id;

    /**
     * 任务ID
     */
    private Integer taskId;

    /**
     * 步骤模版ID
     */
    private Integer stepTemplateId;

    /**
     * 步骤名称
     */
    private String stepName;

    /**
     * 参数值列表
     */
    private List<ParameterValueVO> parameterValues;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}
