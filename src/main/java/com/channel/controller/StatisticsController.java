package com.channel.controller;

import com.channel.mapper.ChannelLogMapper;
import com.channel.model.DayStatLog;
import com.channel.service.query.ChannelLogQuery;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.channel.model.ChannelStatLog;

import java.util.List;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/30
 */
@RestController
public class StatisticsController {

    private Logger logger = LoggerFactory.getLogger("STATISTICS");

    private final ChannelLogMapper channelLogMapper;

    @Autowired
    public StatisticsController(ChannelLogMapper channelLogMapper) {
        this.channelLogMapper = channelLogMapper;
    }

    @GetMapping("/api/statistics/day/list")
    public ResponseEntity<PageInfo<DayStatLog>> listByDay(ChannelLogQuery query) {
        if (query.getPage() != null && query.getRows() != null) {
            PageHelper.startPage(query.getPage(), query.getRows());
        }
        if (StringUtils.isNotBlank(query.getOrderColumn())) {
            if (StringUtils.isNoneBlank(query.getOrderDir())) {
                PageHelper.orderBy(query.getOrderColumn() + " " + query.getOrderDir());
            } else {
                PageHelper.orderBy(query.getOrderColumn());
            }
        }
        List<DayStatLog> logs = channelLogMapper.statisticsByDay(query);
        PageInfo<DayStatLog> result = new PageInfo<>(logs);
        return query.getDraw() == null ? ResponseEntity.ok().body(result)
                : ResponseEntity.ok().header("x-app-draw", query.getDraw().toString()).body(result);
    }

    @GetMapping({"/api/statistics/channel/list", "/api/home/datacenter/total"})
    public ResponseEntity<PageInfo<ChannelStatLog>> listByChannel(ChannelLogQuery query) {
        if (query.getPage() != null && query.getRows() != null) {
            PageHelper.startPage(query.getPage(), query.getRows());
        }
        if (StringUtils.isNotBlank(query.getOrderColumn())) {
            if (StringUtils.isNoneBlank(query.getOrderDir())) {
                PageHelper.orderBy(query.getOrderColumn() + " " + query.getOrderDir());
            } else {
                PageHelper.orderBy(query.getOrderColumn());
            }
        }
        if (StringUtils.isNotBlank(query.getChannelName())) {
            query.setChannelName("%" + query.getChannelName().trim() + "%");
        } else {
            query.setChannelName(null);
        }
        List<ChannelStatLog> logs = channelLogMapper.statisticsByChannel(query);
        PageInfo<ChannelStatLog> result = new PageInfo<>(logs);
        return query.getDraw() == null ? ResponseEntity.ok().body(result)
                : ResponseEntity.ok().header("x-app-draw", query.getDraw().toString()).body(result);
    }


}
