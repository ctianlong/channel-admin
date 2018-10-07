package tk.mybatis.springboot.model;

import java.io.Serializable;

/**
 * @Description 渠道
 * @Auther ctl
 * @Date 2018/9/19
 */
public class Channel implements Serializable {

    private static final long serialVersionUID = 9201149244192707180L;

    /**
     * `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
     * `channelName` varchar(255) DEFAULT '' COMMENT '渠道名称',
     * `payType` int(11) DEFAULT '0' COMMENT '付费方式0-cpm 1-cpc 2-cpa',
     * `price` int(11) DEFAULT '0' COMMENT '单价',
     * `parentId` bigint(20) DEFAULT '0' COMMENT '父渠道id',
     * `createTime` bigint(20) DEFAULT '0' COMMENT '记录创建时间',
     * `updateTime` bigint(20) DEFAULT '0' COMMENT '记录更新时间',
     */
    private long id;
    private String channelName;
    private int payType;
    private int price;
    private long parentId; // 父渠道的parentId为0
    private long createTime;
    private long updateTime;

    // 此处直接加个parentChannelName用于前端显示
    private String parentChannelName;

    public String getParentChannelName() {
        return parentChannelName;
    }

    public void setParentChannelName(String parentChannelName) {
        this.parentChannelName = parentChannelName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
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
