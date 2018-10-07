package tk.mybatis.springboot.service.query;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/26
 */
public class ChannelQuery extends CommonQuery {

    private String channelName;
    private Boolean parent; // 查询条件：是否是父渠道，父渠道的parentId为0

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public Boolean getParent() {
        return parent;
    }

    public void setParent(Boolean parent) {
        this.parent = parent;
    }
}
