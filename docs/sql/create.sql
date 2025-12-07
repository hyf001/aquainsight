-- aquainsight.department definition

CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `name` varchar(100) NOT NULL COMMENT '部门名称',
  `parent_id` int(11) DEFAULT '0' COMMENT '父部门ID (0为顶级)',
  `sort` int(11) DEFAULT '0' COMMENT '排序号',
  `leader_id` int(11) DEFAULT NULL COMMENT '负责人ID',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_leader_id` (`leader_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- aquainsight.device definition

CREATE TABLE `device` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '设备实例ID',
  `device_code` varchar(50) NOT NULL COMMENT '设备编码(唯一标识)',
  `device_name` varchar(100) NOT NULL COMMENT '设备名称',
  `site_id` int(11) NOT NULL COMMENT '所属站点ID',
  `device_model_id` int(11) NOT NULL COMMENT '设备型号ID',
  `serial_number` varchar(100) DEFAULT NULL COMMENT '设备序列号',
  `install_location` varchar(100) DEFAULT NULL COMMENT '安装位置',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态(0-离线,1-在线,2-故障)',
  `install_date` date DEFAULT NULL COMMENT '安装日期',
  `maintenance_date` date DEFAULT NULL COMMENT '维护日期',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_device_code` (`device_code`),
  KEY `idx_site_id` (`site_id`),
  KEY `idx_device_model_id` (`device_model_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='设备实例表';


-- aquainsight.device_model definition

CREATE TABLE `device_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '设备型号ID',
  `model_code` varchar(50) NOT NULL COMMENT '型号编码',
  `model_name` varchar(100) NOT NULL COMMENT '型号名称',
  `device_type` varchar(50) DEFAULT NULL COMMENT '设备类型',
  `manufacturer` varchar(100) DEFAULT NULL COMMENT '制造商',
  `description` varchar(500) DEFAULT NULL COMMENT '设备描述',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  `factor_id` int(11) DEFAULT NULL COMMENT '因子id',
  `specifications` varchar(100) DEFAULT NULL COMMENT '规格参数',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_model_code` (`model_code`),
  KEY `idx_device_type` (`device_type`),
  KEY `idx_manufacturer` (`manufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='设备型号表';

-- aquainsight.enterprise definition

CREATE TABLE `enterprise` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '企业ID',
  `enterprise_code` varchar(50) NOT NULL COMMENT '企业编码(统一社会信用编码)',
  `enterprise_name` varchar(100) NOT NULL COMMENT '企业名称',
  `enterprise_tag` varchar(100) DEFAULT NULL COMMENT '企业标签',
  `contact_person` varchar(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `address` varchar(255) DEFAULT NULL COMMENT '企业地址',
  `description` varchar(500) DEFAULT NULL COMMENT '企业描述',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_enterprise_code` (`enterprise_code`),
  KEY `idx_enterprise_name` (`enterprise_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='企业表';

-- aquainsight.factor definition

CREATE TABLE `factor` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '因子ID',
  `factor_code` varchar(50) NOT NULL COMMENT '因子代码',
  `national_code` varchar(50) DEFAULT NULL COMMENT '国标代码',
  `factor_name` varchar(100) NOT NULL COMMENT '因子名称',
  `short_name` varchar(50) DEFAULT NULL COMMENT '简称',
  `category` varchar(50) DEFAULT NULL COMMENT '所属类别(水环境质量/大气环境质量)',
  `unit` varchar(20) DEFAULT NULL COMMENT '单位',
  `upper_limit` decimal(10,4) DEFAULT NULL COMMENT '上限值',
  `lower_limit` decimal(10,4) DEFAULT NULL COMMENT '下限值',
  `precision_digits` int(11) DEFAULT '2' COMMENT '精度位数',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_factor_code` (`factor_code`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='监测因子表';

-- aquainsight.job_category definition

CREATE TABLE `job_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '作业类别ID',
  `name` varchar(100) NOT NULL COMMENT '类别名称',
  `code` varchar(50) NOT NULL COMMENT '类别编码',
  `need_photo` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要拍照(0-不需要,1-需要)',
  `photo_types` varchar(200) DEFAULT NULL COMMENT '照片类型，多个之间逗号分隔',
  `overdue_days` int(11) NOT NULL DEFAULT '0' COMMENT '逾期天数',
  `description` varchar(500) DEFAULT NULL COMMENT '类别描述',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_job_category_code` (`code`),
  KEY `idx_job_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='作业类别表';


-- aquainsight.scheme definition

CREATE TABLE `scheme` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '方案ID',
  `name` varchar(100) NOT NULL COMMENT '方案名称',
  `code` varchar(50) NOT NULL COMMENT '方案编码',
  `creator` varchar(50) NOT NULL COMMENT '创建人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_scheme_code` (`code`),
  KEY `idx_scheme_name` (`name`),
  KEY `idx_creator` (`creator`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='维护方案表';


-- aquainsight.scheme_item definition

CREATE TABLE `scheme_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '方案项目ID',
  `scheme_id` int(11) NOT NULL COMMENT '所属方案ID',
  `name` varchar(100) NOT NULL COMMENT '项目名称',
  `job_category_id` int(11) NOT NULL COMMENT '作业类别ID',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  `description` varchar(100) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='方案项目表';


-- aquainsight.site definition

CREATE TABLE `site` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '站点ID',
  `site_code` varchar(50) NOT NULL COMMENT '站点编码',
  `site_name` varchar(100) NOT NULL COMMENT '站点名称',
  `site_type` varchar(50) DEFAULT NULL COMMENT '站点类型(污水/雨水)',
  `site_tag` varchar(100) DEFAULT NULL COMMENT '站点标签',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `enterprise_name` varchar(100) DEFAULT NULL COMMENT '企业名称',
  `is_auto_upload` tinyint(1) DEFAULT '0' COMMENT '是否需要自动填报(0-否,1-是)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  `enterprise_id` int(11) DEFAULT NULL COMMENT '所属企业ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_site_code` (`site_code`),
  KEY `idx_site_type` (`site_type`),
  KEY `idx_enterprise_name` (`enterprise_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='站点表';


-- aquainsight.site_job_plan definition

CREATE TABLE `site_job_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `site_id` int(11) NOT NULL COMMENT '所属站点ID',
  `period_config` varchar(200) DEFAULT NULL COMMENT '站点周期计划配置json',
  `scheme_id` int(11) DEFAULT NULL COMMENT '所属方案ID',
  `creator` varchar(50) NOT NULL COMMENT '创建人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  `department_id` int(11) DEFAULT NULL COMMENT '组织id',
  `job_plan_state` varchar(100) DEFAULT NULL COMMENT '任务计划状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='站点任务计划表';
-- aquainsight.`user` definition

CREATE TABLE `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `name` varchar(50) DEFAULT NULL COMMENT '姓名',
  `gender` varchar(10) DEFAULT '男' COMMENT '性别',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态(0-禁用,1-启用)',
  `role` varchar(20) DEFAULT 'user' COMMENT '角色',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';


-- aquainsight.user_department definition

CREATE TABLE `user_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `department_id` int(11) NOT NULL COMMENT '部门ID',
  `is_leader` tinyint(1) DEFAULT '0' COMMENT '是否负责人(0-否,1-是)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_department` (`user_id`,`department_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_department_id` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='用户-部门关系表';

-- aquainsight.site_job_instance definition

CREATE TABLE `site_job_instance` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `site_job_plan_id` int(11) DEFAULT NULL COMMENT '任务计划id',
  `trigger_time` datetime DEFAULT NULL COMMENT '任务派发时间',
  `start_time` datetime DEFAULT NULL COMMENT '任务开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '任务结束时间',
  `status` varchar(100) DEFAULT NULL COMMENT '任务状态',
  `expired_time` datetime DEFAULT NULL COMMENT '任务过期时间',
  `creator` varchar(100) DEFAULT NULL COMMENT '创建人',
  `operator` varchar(100) DEFAULT NULL COMMENT '任务处理人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除标记',
  `site_id` int(11) DEFAULT NULL COMMENT '站点id',
  `scheme_id` int(11) DEFAULT NULL COMMENT '方案id',
  `department_id` int(11) DEFAULT NULL COMMENT '处理小组',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- aquainsight.alert_rule definition

CREATE TABLE `alert_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '告警规则ID',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
  `alert_target_type` varchar(50) NOT NULL COMMENT '告警对象类型(site-站点,device-设备,task-任务)',
  `condition_configs` text COMMENT '告警条件配置(JSON格式,存储阈值、持续时间等条件)',
  `alert_level` int(11) NOT NULL DEFAULT '2' COMMENT '告警级别(1-紧急,2-重要,3-一般,4-提示)',
  `alert_message` varchar(500) DEFAULT NULL COMMENT '告警消息模板',
  `scheme_id` int(11) DEFAULT NULL COMMENT '关联方案ID(用于创建处理任务实例)',
  `notify_types` varchar(100) DEFAULT NULL COMMENT '通知方式(多个逗号分隔: sms-短信,email-邮件,push-推送,wechat-微信)',
  `notify_users` varchar(500) DEFAULT NULL COMMENT '通知人员ID列表(多个逗号分隔)',
  `notify_departments` varchar(500) DEFAULT NULL COMMENT '通知部门ID列表(多个逗号分隔)',
  `enabled` int(11) NOT NULL DEFAULT '1' COMMENT '是否启用(0-禁用,1-启用)',
  `quiet_period` int(11) DEFAULT '0' COMMENT '静默期(分钟),同一规则在静默期内不重复告警',
  `creator` varchar(50) NOT NULL COMMENT '创建人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` int(11) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  `description` varchar(500) DEFAULT NULL COMMENT '规则描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='告警规则表';

-- aquainsight.alert_record definition

CREATE TABLE `alert_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '告警记录ID',
  `rule_id` int(11) NOT NULL COMMENT '关联的规则ID',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称(冗余字段)',
  `rule_type` varchar(50) NOT NULL COMMENT '规则类型(冗余字段)',
  `target_type` varchar(50) DEFAULT NULL COMMENT '告警目标类型(site-站点,device-设备,factor-因子,task-任务)',
  `target_id` int(11) DEFAULT NULL COMMENT '告警目标ID',
  `target_name` varchar(100) DEFAULT NULL COMMENT '告警目标名称',
  `alert_level` int(11) NOT NULL COMMENT '告警级别',
  `alert_message` varchar(1000) NOT NULL COMMENT '告警消息内容',
  `alert_data` text COMMENT '告警相关数据(JSON格式,如超标数值、设备状态等)',
  `job_instance_id` int(11) DEFAULT NULL COMMENT '关联的任务实例ID(任务超时告警时关联触发告警的任务,其他类型告警关联新创建的处理任务)',
  `is_self_task` tinyint(1) DEFAULT '0' COMMENT '是否关联自身任务(0-关联新创建任务,1-关联触发告警的任务本身,如任务超时)',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '告警状态(0-待处理,1-处理中,2-已处理,3-已忽略,4-已恢复)',
  `notify_status` tinyint(1) DEFAULT '0' COMMENT '通知状态(0-未通知,1-已通知,2-通知失败)',
  `notify_time` datetime DEFAULT NULL COMMENT '通知时间',
  `recover_time` datetime DEFAULT NULL COMMENT '恢复正常时间',
  `duration` int(11) DEFAULT NULL COMMENT '持续时长(分钟)',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除,1-已删除)',
  `handler` varchar(100) DEFAULT NULL COMMENT '处理人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='告警记录表';
-- aquainsight.alert_notify_log definition

CREATE TABLE `alert_notify_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '通知日志ID',
  `alert_record_id` bigint(20) NOT NULL COMMENT '告警记录ID',
  `notify_type` varchar(50) NOT NULL COMMENT '通知方式(sms-短信,email-邮件,push-推送,wechat-微信)',
  `notify_target` varchar(100) NOT NULL COMMENT '通知目标(手机号/邮箱/用户ID等)',
  `notify_user_id` int(11) DEFAULT NULL COMMENT '通知用户ID',
  `notify_user_name` varchar(50) DEFAULT NULL COMMENT '通知用户姓名',
  `notify_content` varchar(1000) DEFAULT NULL COMMENT '通知内容',
  `notify_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '通知状态(0-待发送,1-发送成功,2-发送失败)',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `error_message` varchar(500) DEFAULT NULL COMMENT '失败原因',
  `retry_count` int(11) DEFAULT '0' COMMENT '重试次数',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='告警通知日志表';


