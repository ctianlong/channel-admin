package tk.mybatis.springboot.model;

import java.io.Serializable;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/22
 */
public class ChannelLog implements Serializable {

    private static final long serialVersionUID = -4115036756918859992L;

    /**
     * `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
     * `channelId` bigint(20) DEFAULT '0' COMMENT 'channel表的id',
     * `channelName` varchar(255) DEFAULT '' COMMENT '渠道名称',
     * `payType` int(11) DEFAULT '0' COMMENT '付费方式0-cpm 1-cpc 2-cpa',
     * `parentId` bigint(20) DEFAULT '0' COMMENT '父渠道id',
     * `day` int(11) DEFAULT '0' COMMENT '统计日期20180919',
     * `click` int(11) DEFAULT '0' COMMENT '点击数',
     * `display` int(11) DEFAULT '0' COMMENT '展示数',
     * `activity` int(11) DEFAULT '0' COMMENT '激活数',
     * `createTime` bigint(20) DEFAULT '0' COMMENT '记录创建时间',
     * `updateTime` bigint(20) DEFAULT '0' COMMENT '记录更新时间',
     */
    private long id;
    private long channelId;
    private String channelName;
    private int payType;
    private long parentId;
    private int day;
    private int click;
    private int display; // 不要用show，order by show desc会有问题
    private int activity;
    private long createTime;
    private long updateTime;

    // 此处直接加个parentChannelName用于前端显示
    private String parentChannelName;
    private int price;
    private double consume;

    public double getConsume() {
        return consume;
    }

    public void setConsume(double consume) {
        this.consume = consume;
    }

    public String getParentChannelName() {
        return parentChannelName;
    }

    public void setParentChannelName(String parentChannelName) {
        this.parentChannelName = parentChannelName;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getChannelId() {
        return channelId;
    }

    public void setChannelId(long channelId) {
        this.channelId = channelId;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public int getPayType() {
        return payType;
    }

    public void setPayType(int payType) {
        this.payType = payType;
    }

    public long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public int getClick() {
        return click;
    }

    public void setClick(int click) {
        this.click = click;
    }

    public int getDisplay() {
        return display;
    }

    public void setDisplay(int display) {
        this.display = display;
    }

    public int getActivity() {
        return activity;
    }

    public void setActivity(int activity) {
        this.activity = activity;
    }

    public long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }

    public long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(long updateTime) {
        this.updateTime = updateTime;
    }
}
