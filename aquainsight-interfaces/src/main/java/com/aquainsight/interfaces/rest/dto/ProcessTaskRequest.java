package com.aquainsight.interfaces.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

/**
 * 处理任务请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessTaskRequest {

    /**
     * 步骤数据列表
     */
    @NotNull(message = "步骤数据列表不能为空")
    private List<StepData> stepDataList;

    /**
     * 是否完成任务
     */
    private Boolean complete;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StepData {
        /**
         * 步骤模板ID
         */
        @NotNull(message = "步骤模板ID不能为空")
        private Integer stepTemplateId;

        /**
         * 步骤名称
         */
        @NotNull(message = "步骤名称不能为空")
        private String stepName;

        /**
         * 参数Map
         */
        private Map<String, Object> parameters;
    }
}
