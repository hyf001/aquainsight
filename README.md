# AquaInsight

基于DDD（领域驱动设计）的SpringBoot多模块项目

## 项目结构

```
aquainsight
├── aquainsight-api              # 接口定义层
│   ├── dto                      # 基础DTO
│   └── exception                # 异常定义
├── aquainsight-common           # 公共模块
│   ├── config                   # 公共配置（Redis、异常处理器等）
│   ├── component                # 公共组件（消息生产者等）
│   ├── external                 # 外部服务调用基类
│   └── util                     # 工具类
├── aquainsight-domain           # 领域层（DDD核心）
│   ├── consts                   # 领域常量
│   │   ├── entity               # 实体和聚合根
│   │   ├── service              # 领域服务
│   │   ├── repository           # 仓储接口
│   │   ├── event                # 领域事件
│   │   ├── types                # 类型定义
│   │   ├── exception            # 领域异常
│   │   ├── util                 # 领域工具
│   │   └── dto                  # 领域DTO
├── aquainsight-infrastructure   # 基础设施层
│   ├── config                   # 基础设施配置（MyBatis-Plus等）
│   ├── converter                # MapStruct转换器（DO与Entity转换）
│   ├── db                       # 数据库
│   │   ├── model                # 数据库实体（PO）
│   │   ├── dao                  # MyBatis Mapper
│   │   └── converter            # 数据库相关转换
│   ├── repository               # 仓储实现
│   └── external                 # 外部服务
│       ├── feign                # Feign客户端
│       └── rpc                  # RPC服务
├── aquainsight-application      # 应用层
│   ├── manager                  # 应用服务
│   │   ├── dto                  # 应用DTO
│   │   └── assembler            # 转换装配器
│   └── event                    # 事件处理器
├── aquainsight-interfaces       # 接口适配层
│   ├── rest                     # REST接口
│   │   ├── controller           # 命令控制器
│   │   └── query                # 查询接口
│   │       ├── vo               # 视图对象
│   │       └── converter        # VO转换器
│   ├── dto                      # 接口DTO
│   ├── consumer                 # 消息消费者
│   └── job                      # 定时任务
└── aquainsight-deploy           # 部署模块
    └── Application.java         # 启动类
```

## 技术栈

- **SpringBoot**: 2.7.18
- **Java**: 1.8
- **数据库**: MySQL 8.0
- **ORM**: MyBatis-Plus 3.5.3.1
- **缓存**: Redis
- **认证**: Sa-Token 1.37.0
- **对象映射**: MapStruct 1.5.5
- **工具库**: Hutool, FastJSON2, Guava
- **构建工具**: Maven

## 快速开始

### 环境要求

- JDK 1.8+
- MySQL 8.0+
- Redis
- Maven 3.6+

### 配置数据库

1. 创建数据库
```sql
CREATE DATABASE aquainsight DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. 修改配置文件 `aquainsight-deploy/src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/aquainsight
    username: your-username
    password: your-password
```

### 配置Redis

修改配置文件中的Redis连接信息：
```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

### 编译项目

```bash
mvn clean install
```

### 运行项目

```bash
cd aquainsight-deploy
mvn spring-boot:run
```

或者运行打包后的jar：
```bash
java -jar aquainsight-deploy/target/aquainsight-deploy-1.0.0-SNAPSHOT.jar
```

### 指定环境

开发环境：
```bash
java -jar aquainsight-deploy-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
```

生产环境：
```bash
java -jar aquainsight-deploy-1.0.0-SNAPSHOT.jar --spring.profiles.active=prod
```

## DDD分层说明

### 接口定义层（API）
- 定义基础的DTO和异常类
- 被各层共同依赖，不依赖其他层

### 公共层（Common）
- 提供公共工具类、配置和组件
- 全局异常处理器
- Redis配置等基础设施配置

### 领域层（Domain）
- **实体（Entity）**: 具有唯一标识的领域对象
- **值对象（Value Object）**: 无唯一标识的领域对象
- **聚合根（Aggregate Root）**: 管理实体和值对象的边界
- **领域服务（Domain Service）**: 封装领域逻辑
- **仓储接口（Repository）**: 定义数据持久化接口
- **领域事件（Domain Event）**: 表示领域中发生的事件

### 基础设施层（Infrastructure）
- 实现领域层定义的仓储接口
- 数据库访问（MyBatis-Plus）
- 外部服务调用（Feign、RPC）
- 消息队列等技术实现

### 应用层（Application）
- **应用服务（Manager）**: 编排领域服务，实现业务用例
- **事件处理器（Event Handler）**: 处理领域事件
- **DTO转换（Assembler）**: 在不同层之间转换数据

### 接口适配层（Interfaces）
- **REST API**: 对外提供HTTP接口
- **消息消费者**: 监听消息队列
- **定时任务**: 执行定时任务
- **RPC服务**: 提供RPC接口

### 部署层（Deploy）
- 应用启动入口
- 配置文件管理

## 开发规范

### 命名规范

- **PO（Persistent Object）**: 持久化对象，如 `UserPO`
- **Entity**: 领域实体，如 `User`
- **DTO（Data Transfer Object）**: 数据传输对象，如 `UserDTO`
- **VO（View Object）**: 视图对象，如 `UserVO`
- **BO（Business Object）**: 业务对象，如 `UserBO`
- **Converter**: MapStruct转换器，如 `UserConverter`

### 分层调用规则

```
Interfaces -> Application -> Domain <- Infrastructure
```

- Interfaces层调用Application层
- Application层调用Domain层
- Domain层定义接口，Infrastructure层实现
- 严禁跨层调用

### 事务管理

- 事务边界在Application层的Manager中
- 使用`@Transactional`注解控制事务

### 异常处理

- 使用统一的异常处理器`GlobalExceptionHandler`
- 业务异常继承`BaseException`
- 使用`Response<T>`统一返回格式

## 项目扩展

### 添加新模块

1. 在根pom.xml中添加module
2. 创建对应的pom.xml
3. 按照DDD分层原则组织代码

### 集成其他中间件

在相应的pom.xml中添加依赖，并在common或infrastructure层添加配置类。

## 许可证

MIT License
