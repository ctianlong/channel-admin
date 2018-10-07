package tk.mybatis.springboot.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tk.mybatis.springboot.mapper.ChannelMapper;
import tk.mybatis.springboot.model.Channel;
import tk.mybatis.springboot.service.query.ChannelQuery;

import java.util.List;

/**
 * @Description 渠道管理系统 渠道管理菜单下的接口
 * @Auther ctl
 * @Date 2018/9/26
 */
@RestController
@RequestMapping("/api/channel")
public class ChannelController {

    private final Logger logger = LoggerFactory.getLogger("CHANNEL");

    // 直接mapper层，简化
    private final ChannelMapper channelMapper;

    @Autowired
    public ChannelController(ChannelMapper channelMapper) {
        this.channelMapper = channelMapper;
    }

    @GetMapping("/list")
    public ResponseEntity<PageInfo<Channel>> list(ChannelQuery query) {
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
        List<Channel> channels = channelMapper.listByQuery(query);
        PageInfo<Channel> result = new PageInfo<>(channels);
        return query.getDraw() == null ? ResponseEntity.ok().body(result) : ResponseEntity.ok().header("x-app-draw", query.getDraw().toString()).body(result);
    }

    @PostMapping("/add")
    public ResponseEntity<Channel> addOne(@RequestBody Channel channel) {
        if (StringUtils.isBlank(channel.getChannelName()) || channel.getPrice() < 0) {
            return ResponseEntity.badRequest().build();
        }
        long time = System.currentTimeMillis();
        channel.setCreateTime(time);
        channel.setUpdateTime(time);
        try {
            if (channelMapper.addOne(channel) != 1) {
                logger.error("add channel fail, channelName:{}", channel.getChannelName());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            logger.error("add channel fail, channelName:{}", channel.getChannelName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateOne(@RequestBody Channel channel) {
        if (StringUtils.isBlank(channel.getChannelName()) || channel.getPrice() < 0) {
            return ResponseEntity.badRequest().build();
        }
        channel.setUpdateTime(System.currentTimeMillis());
        try {
            if (channelMapper.updateById(channel) != 1) {
                logger.error("update channel fail, id:{}", channel.getId());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            logger.error("update channel fail, id:{}", channel.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteOne(Long id) {
        if (channelMapper.countByParentId(id) > 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            if (channelMapper.deleteOne(id) != 1) {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("delete channel fail, id:{}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.noContent().build();
    }


}
