package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务模版视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskTemplateVO {

    private Integer id;

    private String name;

    private String code;

    private String creator;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    private List<TaskTemplateItemVO> items;
}
