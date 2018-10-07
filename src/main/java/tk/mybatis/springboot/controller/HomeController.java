package tk.mybatis.springboot.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tk.mybatis.springboot.mapper.ChannelLogMapper;
import tk.mybatis.springboot.model.ChannelLog;
import tk.mybatis.springboot.model.DayStatLog;
import tk.mybatis.springboot.service.query.ChannelLogQuery;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description 渠道管理系统首页下的各个数据接口
 * @Auther ctl
 * @Date 2018/9/28
 */
@RestController
@RequestMapping("/api/home")
public class HomeController {

    private final Logger logger = LoggerFactory.getLogger("HOME");

    private final ChannelLogMapper channelLogMapper;

    @Autowired
    public HomeController(ChannelLogMapper channelLogMapper) {
        this.channelLogMapper = channelLogMapper;
    }

    @GetMapping("/datacenter/everyday")
    public ResponseEntity<PageInfo<ChannelLog>> list(ChannelLogQuery query) {
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
        List<ChannelLog> channelLogs = channelLogMapper.listByQuery(query);
        PageInfo<ChannelLog> result = new PageInfo<>(channelLogs);
        // draw 是配合datatables插件，固定这样写就好
        return query.getDraw() == null ? ResponseEntity.ok().body(result) : ResponseEntity.ok().header("x-app-draw", query.getDraw().toString()).body(result);
    }

    @GetMapping("/document/download")
    public void downloadApiDocument(HttpServletResponse response) throws IOException {
        InputStream in = null;
        OutputStream out = null;
        try {
            in = getClass().getClassLoader().getResourceAsStream("doc/document.docx");
            String fileName = URLEncoder.encode("接口文档.docx", "UTF-8");
            response.reset();
            response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            response.setContentType("application/octet-stream; charset=UTF-8");
            out = response.getOutputStream();
            IOUtils.copy(in, out);
            out.flush();
        } finally {
            if (out != null) {
                out.close();
            }
            if (in != null) {
                in.close();
            }
        }
    }

    @GetMapping("/datasum/total")
    public ResponseEntity<Map<String, Object>> total() {
        Map<String, Object> total = channelLogMapper.sumTotal();
        return ResponseEntity.ok().body(total);
    }

    @GetMapping("/download/excel")
    public void export(ChannelLogQuery query, HttpServletResponse response) throws IOException {
        List<ChannelLog> channelLogs = channelLogMapper.listByQuery(query);
        OutputStream outputStream = null;
        XSSFWorkbook workbook = null;
        try {
            workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet("推广数据");
            XSSFRow row = sheet.createRow(0);
            row.createCell(0).setCellValue("父渠道");
            row.createCell(1).setCellValue("渠道");
            row.createCell(2).setCellValue("日期");
            row.createCell(3).setCellValue("报名数");
            row.createCell(4).setCellValue("展示数");
            row.createCell(5).setCellValue("点击数");
            row.createCell(6).setCellValue("消费金额");
            row.createCell(7).setCellValue("单价");
            row.createCell(8).setCellValue("付费方式");

            int len = channelLogs.size();
            for (int i = 0; i < len; i++){
                ChannelLog c = channelLogs.get(i);
                row = sheet.createRow(i + 1);
                if (c.getParentChannelName() != null) {
                    row.createCell(0).setCellValue(c.getParentChannelName());
                }
                if (c.getChannelName() != null) {
                    row.createCell(1).setCellValue(c.getChannelName());
                }
                row.createCell(2).setCellValue(c.getDay());
                row.createCell(3).setCellValue(c.getActivity());
                row.createCell(4).setCellValue(c.getDisplay());
                row.createCell(5).setCellValue(c.getClick());
                row.createCell(6).setCellValue(c.getConsume());
                row.createCell(7).setCellValue(c.getPrice());
                String payType;
                switch (c.getPayType()) {
                    case 0:
                        payType = "cpm";
                        break;
                    case 1:
                        payType = "cpc";
                        break;
                    case 2:
                        payType = "cpa";
                        break;
                    default:
                        payType = "";
                        break;
                }
                row.createCell(8).setCellValue(payType);
            }
            String fileName = URLEncoder.encode("渠道推广数据.xlsx", "UTF-8");
            response.reset();
            response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            response.setContentType("application/octet-stream; charset=UTF-8");
            outputStream = new BufferedOutputStream(response.getOutputStream());
            workbook.write(outputStream);
            outputStream.flush();
        } finally {
            if (outputStream != null) {
                outputStream.close();
            }
            if (workbook != null) {
                workbook.close();
            }
        }
    }

    /**
     * 数据趋势，日期范围优先考虑startDay、endDay，若两者无再考虑days（代表近days天）
     * @param query
     * @return
     */
    @GetMapping("/datasum/datatrend")
    public ResponseEntity<Map<String, Object>> getDataTrend(ChannelLogQuery query) {
        Integer startDay = query.getStartDay();
        Integer endDay = query.getEndDay();
        DateTimeFormatter dtf = DateTimeFormatter.BASIC_ISO_DATE;
        DateTimeFormatter dtf2 = DateTimeFormatter.ISO_LOCAL_DATE;
        if (startDay == null || endDay == null || startDay > endDay) {
            Integer days = query.getDays();
            if (days == null || days <= 0) {
                return ResponseEntity.badRequest().build();
            }
            LocalDate now = LocalDate.now();
            query.setEndDay(Integer.valueOf(now.format(dtf)));
            query.setStartDay(Integer.valueOf(now.minusDays(days - 1).format(dtf)));
        }
        List<DayStatLog> logs = channelLogMapper.statisticsByDay(query);
        Map<Integer, DayStatLog> logsMap = new HashMap<>();
        for (DayStatLog l: logs) {
            logsMap.put(l.getDay(), l);
        }
        List<String> key = new ArrayList<>();
        Map<String, Object> val = new HashMap<>();
        List<Long> activity = new ArrayList<>();
        List<Long> display = new ArrayList<>();
        List<Long> click = new ArrayList<>();
        List<Double> consume = new ArrayList<>();
        LocalDate sDate = LocalDate.parse(query.getStartDay().toString(), dtf);
        LocalDate eDate = LocalDate.parse(query.getEndDay().toString(), dtf);
        long daysNum = ChronoUnit.DAYS.between(sDate, eDate) + 1;
        LocalDate curr;
        for (long i = 0; i < daysNum; i++){
            curr = sDate.plusDays(i);
            key.add(curr.format(dtf2));
            DayStatLog log = logsMap.get(Integer.valueOf(curr.format(dtf)));
            if (log != null) {
                activity.add(log.getTotalActivity());
                display.add(log.getTotalDisplay());
                click.add(log.getTotalClick());
                consume.add(new BigDecimal(log.getTotalConsume()).setScale(2, RoundingMode.UP).doubleValue());
            } else {
                activity.add(0L);
                display.add(0L);
                click.add(0L);
                consume.add(0.0);
            }
        }
        val.put("activity", activity);
        val.put("display", display);
        val.put("click", click);
        val.put("consume", consume);
        Map<String, Object> res = new HashMap<>();
        res.put("key", key);
        res.put("val", val);
        return ResponseEntity.ok(res);
    }

}
