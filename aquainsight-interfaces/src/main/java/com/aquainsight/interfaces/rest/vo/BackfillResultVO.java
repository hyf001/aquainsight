package com.aquainsight.interfaces.rest.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 补齐任务实例结果视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackfillResultVO {

    /**
     * 总共补齐的任务实例数量
     */
    private Integer totalCount;

    /**
     * 补齐的任务实例列表
     */
    private List<JobInstanceInfo> instances;

    /**
     * 任务实例简要信息
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobInstanceInfo {
        /**
         * 任务实例ID
         */
        private Integer id;

        /**
         * 任务派发时间
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime triggerTime;

        /**
         * 任务过期时间
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime expiredTime;

        /**
         * 任务状态
         */
        private String status;

        /**
         * 创建时间
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createTime;
    }
}
