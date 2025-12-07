#!/bin/bash

# AquaInsight 后端启动脚本
# 说明: 用于启动 Spring Boot 应用

echo "========================================="
echo "  AquaInsight 后端服务启动脚本"
echo "========================================="
echo ""

# 检查 Java 是否安装
if ! command -v java &> /dev/null; then
    echo "错误: 未检测到 Java 环境，请先安装 JDK 1.8 或更高版本"
    exit 1
fi

# 显示 Java 版本
echo "当前 Java 版本:"
java -version
echo ""

# 查找 JAR 文件
JAR_FILE=$(find . -maxdepth 1 -name "*.jar" -not -name "*-sources.jar" | head -n 1)

if [ -z "$JAR_FILE" ]; then
    echo "错误: 未找到 JAR 文件"
    echo "提示: 请先运行 'mvn clean package -DskipTests' 编译项目"
    exit 1
fi

echo "找到 JAR 文件: $JAR_FILE"
echo ""

# 检查服务是否已在运行
PID=$(ps -ef | grep "$JAR_FILE" | grep -v grep | awk '{print $2}')
if [ -n "$PID" ]; then
    echo "警告: 服务已在运行 (PID: $PID)"
    echo "请先运行 ./stop.sh 停止服务"
    exit 1
fi

# 配置 JVM 参数
JVM_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# 日志文件
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/application.log"

# 创建日志目录
if [ ! -d "$LOG_DIR" ]; then
    mkdir -p "$LOG_DIR"
fi

# 启动应用
echo "========================================="
echo "  后台启动应用中..."
echo "========================================="
echo "服务端口: 8080"
echo "访问地址: http://localhost:8080"
echo "日志文件: $LOG_FILE"
echo ""

nohup java $JVM_OPTS -jar "$JAR_FILE" > "$LOG_FILE" 2>&1 &

# 获取进程 PID
PID=$!

# 等待一秒检查进程是否启动成功
sleep 2

if ps -p $PID > /dev/null 2>&1; then
    echo "========================================="
    echo "  服务启动成功!"
    echo "========================================="
    echo "进程 PID: $PID"
    echo ""
    echo "查看日志: tail -f $LOG_FILE"
    echo "停止服务: ./stop.sh"
    echo "========================================="
else
    echo "========================================="
    echo "  服务启动失败!"
    echo "========================================="
    echo "请查看日志文件: $LOG_FILE"
    exit 1
fi
