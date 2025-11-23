-- 用户-部门关系表 (多对多)
CREATE TABLE IF NOT EXISTS `user_department` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` INT NOT NULL COMMENT '用户ID',
    `department_id` INT NOT NULL COMMENT '部门ID',
    `is_leader` TINYINT(1) DEFAULT 0 COMMENT '是否负责人(0-否,1-是)',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_department` (`user_id`, `department_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_department_id` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户-部门关系表';
