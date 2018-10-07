package tk.mybatis.springboot.mapper;

import org.apache.ibatis.annotations.Param;
import tk.mybatis.springboot.model.Channel;
import tk.mybatis.springboot.service.query.ChannelQuery;

import java.util.List;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/26
 */
public interface ChannelMapper {
    List<Channel> listByQuery(ChannelQuery query);

    int addOne(Channel channel);

    int deleteOne(@Param("id") Long id);

    int countByParentId(@Param("id") Long id);

    int updateById(Channel channel);
}
