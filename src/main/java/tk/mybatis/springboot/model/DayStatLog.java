package tk.mybatis.springboot.model;

import java.io.Serializable;

/**
 * @Description
 * @Auther ctl
 * @Date 2018/9/30
 */
public class DayStatLog implements Serializable {
    private static final long serialVersionUID = -3938605884015126293L;

    private int day;
    private long totalActivity;
    private long totalDisplay;
    private long totalClick;
    private double totalConsume;

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public long getTotalActivity() {
        return totalActivity;
    }

    public void setTotalActivity(long totalActivity) {
        this.totalActivity = totalActivity;
    }

    public long getTotalDisplay() {
        return totalDisplay;
    }

    public void setTotalDisplay(long totalDisplay) {
        this.totalDisplay = totalDisplay;
    }

    public long getTotalClick() {
        return totalClick;
    }

    public void setTotalClick(long totalClick) {
        this.totalClick = totalClick;
    }

    public double getTotalConsume() {
        return totalConsume;
    }

    public void setTotalConsume(double totalConsume) {
        this.totalConsume = totalConsume;
    }
}
