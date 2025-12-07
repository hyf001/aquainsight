#!/bin/bash

# AquaInsight 后端停止脚本
# 说明: 用于停止正在运行的 Spring Boot 应用

echo "========================================="
echo "  停止 AquaInsight 后端服务"
echo "========================================="
echo ""

# 查找正在运行的 Java 进程
PID=$(ps -ef | grep "aquainsight-deploy" | grep "java" | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "未找到正在运行的 AquaInsight 服务"
    exit 0
fi

echo "找到进程 PID: $PID"
echo "正在停止服务..."

# 发送 SIGTERM 信号
kill $PID

# 等待进程结束
for i in {1..10}; do
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "服务已成功停止"
        exit 0
    fi
    echo "等待服务停止... ($i/10)"
    sleep 1
done

# 如果进程仍在运行，强制终止
if ps -p $PID > /dev/null 2>&1; then
    echo "服务未能正常停止，强制终止..."
    kill -9 $PID
    sleep 1

    if ! ps -p $PID > /dev/null 2>&1; then
        echo "服务已强制停止"
    else
        echo "错误: 无法停止服务"
        exit 1
    fi
fi
