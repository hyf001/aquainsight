package com.aquainsight.interfaces.rest.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 任务模版项目视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskTemplateItemVO {

    private Integer id;

    private Integer taskTemplateId;

    private Integer stepTemplateId;

    private StepTemplateVO stepTemplate;

    private String itemName;

    private String description;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
