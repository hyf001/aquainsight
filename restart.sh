#!/bin/bash

# AquaInsight 后端重启脚本
# 说明: 用于重启 Spring Boot 应用

echo "========================================="
echo "  重启 AquaInsight 后端服务"
echo "========================================="
echo ""

# 停止服务
./stop.sh

# 等待一秒确保端口释放
sleep 2

# 启动服务
./start.sh
