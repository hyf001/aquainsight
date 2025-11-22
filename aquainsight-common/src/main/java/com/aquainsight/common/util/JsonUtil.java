package com.aquainsight.common.util;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONReader;
import com.alibaba.fastjson2.JSONWriter;

/**
 * JSON工具类
 */
public class JsonUtil {

    public static String toJsonString(Object obj) {
        if (obj == null) {
            return null;
        }
        return JSON.toJSONString(obj, JSONWriter.Feature.WriteMapNullValue);
    }

    public static <T> T parseObject(String json, Class<T> clazz) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        return JSON.parseObject(json, clazz, JSONReader.Feature.SupportSmartMatch);
    }
}
