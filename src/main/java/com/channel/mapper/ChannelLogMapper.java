package com.channel.mapper;

import com.channel.service.query.ChannelLogQuery;
import com.channel.model.ChannelLog;
import com.channel.model.ChannelStatLog;
import com.channel.model.DayStatLog;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/28
 */
public interface ChannelLogMapper {
    List<ChannelLog> listByQuery(ChannelLogQuery query);

    Map<String,Object> sumTotal();

    List<DayStatLog> statisticsByDay(ChannelLogQuery query);

    List<ChannelStatLog> statisticsByChannel(ChannelLogQuery query);
}
