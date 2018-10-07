package com.channel;

import org.junit.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/10/1
 */
public class SimpleTest {

    @Test
    public void test1() {
        DateTimeFormatter tf = DateTimeFormatter.ofPattern("yyyyMMdd");
        DateTimeFormatter tf2 = DateTimeFormatter.BASIC_ISO_DATE;
        DateTimeFormatter tf3 = DateTimeFormatter.ISO_LOCAL_DATE;
        System.out.println(LocalDate.now().format(tf3));

        LocalDate start = LocalDate.now();
        System.out.println(start);
        LocalDate end = LocalDate.of(2018, 10, 3);
        System.out.println(end);
        System.out.println(ChronoUnit.DAYS.between(start, end));
    }

}
