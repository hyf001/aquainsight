package com.aquainsight.common.util;

/**
 * ThreadLocal工具类
 * 用于在当前线程中存储和获取用户信息
 */
public class ThreadLocalUtil {

    private static final ThreadLocal<Object> USER_HOLDER = new ThreadLocal<>();

    /**
     * 设置当前用户对象
     */
    public static <T> void setUser(T user) {
        USER_HOLDER.set(user);
    }

    /**
     * 获取当前用户对象
     */
    @SuppressWarnings("unchecked")
    public static <T> T getUser() {
        return (T) USER_HOLDER.get();
    }

    /**
     * 清除当前用户信息
     */
    public static void clear() {
        USER_HOLDER.remove();
    }
}
