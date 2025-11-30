package com.aquainsight.domain.maintenance.types;

import lombok.Data;

@Data
public class PeriodConfig {
    /** 间隔类型 */
    private PeriodType pertioType;
    /** month 表示每月几日 ，week表示每周几  interval表示间隔多少天*/
    private int n;
}
