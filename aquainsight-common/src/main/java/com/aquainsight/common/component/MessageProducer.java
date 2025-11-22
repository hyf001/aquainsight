package com.aquainsight.common.component;

/**
 * 消息生产者接口
 * 用于发送消息到消息队列
 */
public interface MessageProducer {

    /**
     * 发送消息
     *
     * @param topic 主题
     * @param message 消息内容
     */
    void send(String topic, Object message);
}
