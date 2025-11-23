-- 站点表
CREATE TABLE IF NOT EXISTS `site` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '站点ID',
    `site_code` VARCHAR(50) NOT NULL COMMENT '站点编码',
    `site_name` VARCHAR(100) NOT NULL COMMENT '站点名称',
    `site_type` VARCHAR(50) DEFAULT NULL COMMENT '站点类型(污水/雨水)',
    `site_tag` VARCHAR(100) DEFAULT NULL COMMENT '站点标签',
    `longitude` DECIMAL(10, 6) DEFAULT NULL COMMENT '经度',
    `latitude` DECIMAL(10, 6) DEFAULT NULL COMMENT '纬度',
    `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
    `enterprise_name` VARCHAR(100) DEFAULT NULL COMMENT '企业名称',
    `is_auto_upload` TINYINT(1) DEFAULT 0 COMMENT '是否需要自动填报(0-否,1-是)',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除,1-已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_site_code` (`site_code`),
    KEY `idx_site_type` (`site_type`),
    KEY `idx_enterprise_name` (`enterprise_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点表';

-- 设备型号表(设备类型定义)
CREATE TABLE IF NOT EXISTS `device_model` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '设备型号ID',
    `model_code` VARCHAR(50) NOT NULL COMMENT '型号编码',
    `model_name` VARCHAR(100) NOT NULL COMMENT '型号名称',
    `device_type` VARCHAR(50) DEFAULT NULL COMMENT '设备类型',
    `manufacturer` VARCHAR(100) DEFAULT NULL COMMENT '制造商',
    `description` VARCHAR(500) DEFAULT NULL COMMENT '设备描述',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除,1-已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_model_code` (`model_code`),
    KEY `idx_device_type` (`device_type`),
    KEY `idx_manufacturer` (`manufacturer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备型号表';

-- 设备实例表(具体的设备)
CREATE TABLE IF NOT EXISTS `device` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '设备实例ID',
    `device_code` VARCHAR(50) NOT NULL COMMENT '设备编码(唯一标识)',
    `device_name` VARCHAR(100) NOT NULL COMMENT '设备名称',
    `site_id` INT NOT NULL COMMENT '所属站点ID',
    `device_model_id` INT NOT NULL COMMENT '设备型号ID',
    `serial_number` VARCHAR(100) DEFAULT NULL COMMENT '设备序列号',
    `install_location` VARCHAR(100) DEFAULT NULL COMMENT '安装位置',
    `status` TINYINT(1) DEFAULT 1 COMMENT '状态(0-离线,1-在线,2-故障)',
    `install_date` DATE DEFAULT NULL COMMENT '安装日期',
    `maintenance_date` DATE DEFAULT NULL COMMENT '维护日期',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除,1-已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_device_code` (`device_code`),
    KEY `idx_site_id` (`site_id`),
    KEY `idx_device_model_id` (`device_model_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备实例表';

-- 因子表(监测因子)
CREATE TABLE IF NOT EXISTS `factor` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '因子ID',
    `factor_code` VARCHAR(50) NOT NULL COMMENT '因子代码',
    `national_code` VARCHAR(50) DEFAULT NULL COMMENT '国标代码',
    `factor_name` VARCHAR(100) NOT NULL COMMENT '因子名称',
    `short_name` VARCHAR(50) DEFAULT NULL COMMENT '简称',
    `device_model_id` INT NOT NULL COMMENT '所属设备型号ID',
    `category` VARCHAR(50) DEFAULT NULL COMMENT '所属类别(水环境质量/大气环境质量)',
    `unit` VARCHAR(20) DEFAULT NULL COMMENT '单位',
    `upper_limit` DECIMAL(10, 4) DEFAULT NULL COMMENT '上限值',
    `lower_limit` DECIMAL(10, 4) DEFAULT NULL COMMENT '下限值',
    `precision_digits` INT DEFAULT 2 COMMENT '精度位数',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除,1-已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_factor_code` (`factor_code`),
    KEY `idx_device_model_id` (`device_model_id`),
    KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='监测因子表';

-- 插入示例设备型号数据
INSERT INTO `device_model` (`model_code`, `model_name`, `device_type`, `manufacturer`, `description`) VALUES
('WQ-2000', '水质在线监测仪-2000型', '水质监测', 'XX环保科技', '可监测PH、COD、TOC、TP、氨氮、总镍等水质指标'),
('AQ-3000', '大气质量监测仪-3000型', '大气监测', 'XX环保科技', '可监测PM2.5、PM10、SO2、NO2等大气指标')
ON DUPLICATE KEY UPDATE `model_name` = VALUES(`model_name`);

-- 插入示例因子数据(水环境质量 - 关联设备型号ID=1)
INSERT INTO `factor` (`factor_code`, `national_code`, `factor_name`, `short_name`, `device_model_id`, `category`, `unit`, `upper_limit`, `lower_limit`, `precision_digits`) VALUES
('w01001', 'w01001', '酸碱度', 'PH', 1, '水环境质量', '', 14.0000, 0.0000, 2),
('w01018', 'w01018', '化学需氧量', 'COD', 1, '水环境质量', 'mg/L', 1000.0000, 0.0000, 2),
('w01020', 'w01020', '总有机碳', 'TOC', 1, '水环境质量', 'mg/L', 100.0000, 0.0000, 2),
('w21011', 'w21011', '总磷', 'TP', 1, '水环境质量', 'mg/L', 10.0000, 0.0000, 3),
('w21003', 'w21003', '氨氮', 'NH3-N', 1, '水环境质量', 'mg/L', 50.0000, 0.0000, 3),
('w20121', 'w20121', '总镍', 'Ni', 1, '水环境质量', 'mg/L', 5.0000, 0.0000, 4)
ON DUPLICATE KEY UPDATE `factor_name` = VALUES(`factor_name`);

-- 插入示例站点数据
INSERT INTO `site` (`site_code`, `site_name`, `site_type`, `site_tag`, `longitude`, `latitude`, `address`, `enterprise_name`, `is_auto_upload`) VALUES
('32058232HTYY...', '华天药业...', '污水', '非国控', 120.473157, 31.953243, NULL, NULL, 0),
('32058232HTYYYS', '华天药业...', '雨水', '非国控', 120.473157, 31.953243, NULL, NULL, 0),
('32058232FJHXYS', '发基化学...', '雨水', '非国控', 120.463176, 31.960412, NULL, NULL, 0)
ON DUPLICATE KEY UPDATE `site_name` = VALUES(`site_name`);

-- 插入示例设备实例数据
INSERT INTO `device` (`device_code`, `device_name`, `site_id`, `device_model_id`, `serial_number`, `install_location`, `status`, `install_date`) VALUES
('DEV-001', '华天药业污水监测设备1号', 1, 1, 'SN202501001', '污水排口', 1, '2025-01-01'),
('DEV-002', '华天药业雨水监测设备1号', 2, 1, 'SN202501002', '雨水排口', 1, '2025-01-01'),
('DEV-003', '发基化学雨水监测设备1号', 3, 1, 'SN202501003', '雨水排口', 1, '2025-01-01')
ON DUPLICATE KEY UPDATE `device_name` = VALUES(`device_name`);
