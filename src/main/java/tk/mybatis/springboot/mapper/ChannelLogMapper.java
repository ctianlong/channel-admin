package tk.mybatis.springboot.mapper;

import tk.mybatis.springboot.model.ChannelLog;
import tk.mybatis.springboot.model.ChannelStatLog;
import tk.mybatis.springboot.model.DayStatLog;
import tk.mybatis.springboot.service.query.ChannelLogQuery;

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
