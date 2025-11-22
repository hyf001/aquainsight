-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `name` VARCHAR(50) NOT NULL COMMENT '姓名',
    `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
    `role` VARCHAR(20) DEFAULT 'user' COMMENT '角色',
    `department_id` INT DEFAULT NULL COMMENT '所属部门ID',
    `is_leader` TINYINT(1) DEFAULT 0 COMMENT '是否负责人(0-否,1-是)',
    `status` TINYINT(1) DEFAULT 1 COMMENT '状态(0-禁用,1-启用)',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除,1-已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_phone` (`phone`),
    UNIQUE KEY `uk_email` (`email`),
    KEY `idx_role` (`role`),
    KEY `idx_department_id` (`department_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认管理员用户 (密码: admin123)
INSERT INTO `user` (`password`, `name`, `phone`, `email`, `role`)
VALUES ('admin123', '管理员', '13800138000', 'admin@aquainsight.com', 'admin')
ON DUPLICATE KEY UPDATE `name` = `name`;
