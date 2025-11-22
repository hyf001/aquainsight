-- 部门表
CREATE TABLE IF NOT EXISTS `department` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '部门ID',
    `name` VARCHAR(100) NOT NULL COMMENT '部门名称',
    `parent_id` INT DEFAULT 0 COMMENT '父部门ID (0为顶级)',
    `sort` INT DEFAULT 0 COMMENT '排序号',
    `leader_id` INT DEFAULT NULL COMMENT '负责人ID',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除,1-已删除)',
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_leader_id` (`leader_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 修改用户表，添加部门相关字段
ALTER TABLE `user`
ADD COLUMN `gender` VARCHAR(10) DEFAULT '男' COMMENT '性别' AFTER `name`,
ADD COLUMN `department_id` INT DEFAULT NULL COMMENT '所属部门ID' AFTER `avatar`,
ADD COLUMN `is_leader` TINYINT(1) DEFAULT 0 COMMENT '是否负责人(0-否,1-是)' AFTER `department_id`,
ADD COLUMN `status` TINYINT(1) DEFAULT 1 COMMENT '状态(0-禁用,1-启用)' AFTER `is_leader`,
ADD KEY `idx_department_id` (`department_id`);

-- 插入示例部门数据
INSERT INTO `department` (`id`, `name`, `parent_id`, `sort`) VALUES
(1, '江苏远畅环保', 0, 1),
(2, '运维部', 1, 1),
(3, '污水一组', 2, 1),
(4, '污水二组', 2, 2),
(5, '污水三组', 2, 3),
(6, '测试部门', 1, 2)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 更新管理员用户的部门信息
UPDATE `user` SET `department_id` = 2, `is_leader` = 1, `status` = 1 WHERE `username` = 'admin';
