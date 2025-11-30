package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 方案视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeVO {

    private Integer id;

    private String name;

    private String code;

    private String creator;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    private List<SchemeItemVO> items;
}
