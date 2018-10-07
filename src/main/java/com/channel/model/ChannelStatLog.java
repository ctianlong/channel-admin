package com.channel.model;

import java.io.Serializable;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/30
 */
public class ChannelStatLog implements Serializable {
    private static final long serialVersionUID = 6510354770812068338L;

    private String parentChannelName;
    private String channelName;
    private long totalActivity;
    private long totalDisplay;
    private long totalClick;
    private double totalConsume;
    private int price;
    private int payType;

    public String getParentChannelName() {
        return parentChannelName;
    }

    public void setParentChannelName(String parentChannelName) {
        this.parentChannelName = parentChannelName;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public long getTotalActivity() {
        return totalActivity;
    }

    public void setTotalActivity(long totalActivity) {
        this.totalActivity = totalActivity;
    }

    public long getTotalDisplay() {
        return totalDisplay;
    }

    public void setTotalDisplay(long totalDisplay) {
        this.totalDisplay = totalDisplay;
    }

    public long getTotalClick() {
        return totalClick;
    }

    public void setTotalClick(long totalClick) {
        this.totalClick = totalClick;
    }

    public double getTotalConsume() {
        return totalConsume;
    }

    public void setTotalConsume(double totalConsume) {
        this.totalConsume = totalConsume;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getPayType() {
        return payType;
    }

    public void setPayType(int payType) {
        this.payType = payType;
    }
}
