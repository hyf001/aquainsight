package com.aquainsight.domain.alert.service.impl;

import com.aquainsight.domain.alert.entity.Metric;
import com.aquainsight.domain.maintenance.entity.SiteJobInstance;
import com.aquainsight.domain.maintenance.repository.SiteJobInstanceRepository;
import com.aquainsight.domain.maintenance.types.JobInstanceStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 任务指标采集器测试类
 */
@ExtendWith(MockitoExtension.class)
class TaskMetricCollectorTest {

    @Mock
    private SiteJobInstanceRepository siteJobInstanceRepository;

    @InjectMocks
    private TaskMetricCollector taskMetricCollector;

    private SiteJobInstance jobInstance;
    private Integer testJobInstanceId = 100;

    @BeforeEach
    void setUp() {
        // 初始化测试用的作业实例
        jobInstance = SiteJobInstance.builder()
                .id(testJobInstanceId)
                .status(JobInstanceStatus.PENDING)
                .triggerTime(LocalDateTime.now().minusHours(2))
                .expiredTime(LocalDateTime.now().plusHours(12)) // 12小时后过期
                .build();
    }

    @Test
    void testSupports() {
        // 测试支持的指标
        assertTrue(taskMetricCollector.supports("任务即将到期"));
        assertTrue(taskMetricCollector.supports("任务超时"));

        // 测试不支持的指标
        assertFalse(taskMetricCollector.supports("不存在的指标"));
        assertFalse(taskMetricCollector.supports("pH值"));
    }

    @Test
    void testCollect_WithInvalidTargetType() {
        // 测试错误的目标类型
        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "site", testJobInstanceId);

        assertTrue(metrics.isEmpty());
        verify(siteJobInstanceRepository, never()).findById(any());
    }

    @Test
    void testCollect_WithNonExistentJobInstance() {
        // 模拟作业实例不存在
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(null);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        assertTrue(metrics.isEmpty());
        verify(siteJobInstanceRepository, times(1)).findById(testJobInstanceId);
    }

    @Test
    void testCollectTaskDueSoon_WillExpireIn12Hours() {
        // 测试任务即将到期 - 12小时后过期（在24小时阈值内）
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(12));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        assertNotNull(metrics);
        assertEquals(1, metrics.size());

        Metric metric = metrics.get(0);
        assertEquals("任务即将到期", metric.getName());
        assertEquals("task", metric.getTargetType());
        assertEquals(testJobInstanceId, metric.getTargetId());
        assertEquals(BigDecimal.ONE, metric.getValue()); // 应该触发告警
        assertNotNull(metric.getCollectTime());
    }

    @Test
    void testCollectTaskDueSoon_WillExpireIn2Hours() {
        // 测试任务即将到期 - 2小时后过期（在24小时阈值内）
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(2));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ONE, metric.getValue()); // 应该触发告警
    }

    @Test
    void testCollectTaskDueSoon_WillExpireIn30Hours() {
        // 测试任务不会即将到期 - 30小时后过期（超过24小时阈值）
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(30));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 不应该触发告警
    }

    @Test
    void testCollectTaskDueSoon_AlreadyExpired() {
        // 测试任务已经过期 - 不应该触发"即将到期"告警
        jobInstance.setExpiredTime(LocalDateTime.now().minusHours(1));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 不应该触发告警
    }

    @Test
    void testCollectTaskDueSoon_CompletedTask() {
        // 测试已完成的任务 - 不应该触发告警
        jobInstance.setStatus(JobInstanceStatus.COMPLETED);
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(12));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 已完成不告警
    }

    @Test
    void testCollectTaskDueSoon_OverdueTask() {
        // 测试已逾期的任务 - 不应该触发"即将到期"告警
        jobInstance.setStatus(JobInstanceStatus.OVERDUE);
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(12));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 已逾期不触发"即将到期"告警
    }

    @Test
    void testCollectTaskDueSoon_NoExpiredTime() {
        // 测试没有过期时间的任务
        jobInstance.setExpiredTime(null);
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 没有过期时间，不告警
    }

    @Test
    void testCollectTaskTimeout_NotTimeout() {
        // 测试任务未超时 - 12小时后过期
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(12));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);

        assertNotNull(metrics);
        assertEquals(1, metrics.size());

        Metric metric = metrics.get(0);
        assertEquals("任务超时", metric.getName());
        assertEquals("task", metric.getTargetType());
        assertEquals(testJobInstanceId, metric.getTargetId());
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 未超时
        assertNotNull(metric.getCollectTime());
    }

    @Test
    void testCollectTaskTimeout_AlreadyTimeout() {
        // 测试任务已超时 - 1小时前就过期了
        jobInstance.setExpiredTime(LocalDateTime.now().minusHours(1));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ONE, metric.getValue()); // 已超时，应该触发告警
    }

    @Test
    void testCollectTaskTimeout_JustExpired() {
        // 测试任务刚好过期
        jobInstance.setExpiredTime(LocalDateTime.now().minusMinutes(1));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ONE, metric.getValue()); // 刚过期，应该触发告警
    }

    @Test
    void testCollectTaskTimeout_OverdueStatus() {
        // 测试任务状态为逾期
        jobInstance.setStatus(JobInstanceStatus.OVERDUE);
        jobInstance.setExpiredTime(LocalDateTime.now().minusHours(2));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ONE, metric.getValue()); // 状态为逾期，应该触发告警
    }

    @Test
    void testCollectTaskTimeout_CompletedTask() {
        // 测试已完成的任务，即使已过期也不告警
        jobInstance.setStatus(JobInstanceStatus.COMPLETED);
        jobInstance.setExpiredTime(LocalDateTime.now().minusHours(1));
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 已完成不告警
    }

    @Test
    void testCollectTaskTimeout_NoExpiredTime() {
        // 测试没有过期时间的任务
        jobInstance.setExpiredTime(null);
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);

        Metric metric = metrics.get(0);
        assertEquals(BigDecimal.ZERO, metric.getValue()); // 没有过期时间，不告警
    }

    @Test
    void testCollect_UnsupportedMetric() {
        // 测试不支持的指标
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        List<Metric> metrics = taskMetricCollector.collect("不存在的指标", "task", testJobInstanceId);

        assertTrue(metrics.isEmpty()); // 不支持的指标应该返回空列表
    }

    @Test
    void testCollectBothMetrics() {
        // 测试同时采集两个指标
        jobInstance.setExpiredTime(LocalDateTime.now().plusHours(12)); // 12小时后过期
        when(siteJobInstanceRepository.findById(testJobInstanceId)).thenReturn(jobInstance);

        // 采集"任务即将到期"指标
        List<Metric> dueSoonMetrics = taskMetricCollector.collect("任务即将到期", "task", testJobInstanceId);
        assertEquals(1, dueSoonMetrics.size());
        assertEquals(BigDecimal.ONE, dueSoonMetrics.get(0).getValue()); // 应该触发

        // 采集"任务超时"指标
        List<Metric> timeoutMetrics = taskMetricCollector.collect("任务超时", "task", testJobInstanceId);
        assertEquals(1, timeoutMetrics.size());
        assertEquals(BigDecimal.ZERO, timeoutMetrics.get(0).getValue()); // 不应该触发
    }
}
