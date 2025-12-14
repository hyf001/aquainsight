package com.aquainsight.interfaces.rest.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 参数值视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParameterValueVO {

    /**
     * 参数名称
     */
    private String name;

    /**
     * 参数值
     */
    private Object value;

    /**
     * 填写时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fillTime;
}
