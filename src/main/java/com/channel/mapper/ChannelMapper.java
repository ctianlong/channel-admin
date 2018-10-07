package com.channel.mapper;

import com.channel.service.query.ChannelQuery;
import org.apache.ibatis.annotations.Param;
import com.channel.model.Channel;

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
