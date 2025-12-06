-- 数据迁移脚本：将 alert_rule 表中的 alert_target_type 从枚举名改为代码值
-- 执行时间：2025-12-06
-- 说明：将 SITE/DEVICE/TASK 转换为 site/device/task

-- 更新告警目标类型从枚举名到代码值
UPDATE alert_rule
SET alert_target_type = CASE
    WHEN alert_target_type = 'SITE' THEN 'site'
    WHEN alert_target_type = 'DEVICE' THEN 'device'
    WHEN alert_target_type = 'TASK' THEN 'task'
    ELSE alert_target_type
END
WHERE alert_target_type IN ('SITE', 'DEVICE', 'TASK');

-- 验证迁移结果
SELECT alert_target_type, COUNT(*) as count
FROM alert_rule
GROUP BY alert_target_type;
