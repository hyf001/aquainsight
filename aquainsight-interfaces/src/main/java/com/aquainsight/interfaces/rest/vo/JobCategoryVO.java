package com.aquainsight.interfaces.rest.vo;

import com.aquainsight.interfaces.rest.dto.JobParameterDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 作业类别视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCategoryVO {

    private Integer id;

    private String name;

    private String code;

    private List<JobParameterDTO> parameters;

    private Integer overdueDays;

    private String description;

    private String createTime;

    private String updateTime;
}
