#!/bin/bash

# AquaInsight 后端开发模式启动脚本
# 说明: 用于开发环境快速启动，使用 Spring Boot Maven 插件

echo "========================================="
echo "  AquaInsight 后端服务 (开发模式)"
echo "========================================="
echo ""

# 检查 Maven 是否安装
if ! command -v mvn &> /dev/null; then
    echo "错误: 未检测到 Maven，请先安装 Maven"
    exit 1
fi

echo "开发模式启动，无需打包编译..."
echo ""
echo "========================================="
echo "  启动应用中..."
echo "========================================="
echo "服务端口: 8080"
echo "访问地址: http://localhost:8080"
echo ""
echo "按 Ctrl+C 可停止服务"
echo "========================================="
echo ""

# 使用 Spring Boot Maven 插件启动
cd aquainsight-deploy
mvn spring-boot:run
