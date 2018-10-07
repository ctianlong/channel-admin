package tk.mybatis.springboot.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import tk.mybatis.springboot.conf.Constants;

@Table(name = "account_user")
public class AccountUser implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
     * 主键
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 密码
     */
    private String password;

    /**
     * 用户名
     */
    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    private String username;

    /**
     * 姓名
     */
    @NotNull
    @Pattern(regexp = Constants.NO_FIRST_LAST_SPACE_REGEX)
    private String chname;

    /**
     * 联系方式
     */
    private String phone;

    /**
     * 工作单位
     */
    private String company;

    /**
     * 通讯地址
     */
    private String address;

    /**
     * 是否管理员
     */
    @Column(name = "is_superuser")
    private Boolean superuser;

    /**
     * 创建时间
     */
    @Column(name = "gmt_create")
    private Date gmtCreate;

    /**
     * 修改时间
     */
    @Column(name = "gmt_modified")
    private Date gmtModified;

    /**
     * 获取主键
     *
     * @return id - 主键
     */
    public Integer getId() {
        return id;
    }

    /**
     * 设置主键
     *
     * @param id 主键
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * 获取密码
     *
     * @return password - 密码
     */
    public String getPassword() {
        return password;
    }

    /**
     * 设置密码
     *
     * @param password 密码
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * 获取用户名
     *
     * @return username - 用户名
     */
    public String getUsername() {
        return username;
    }

    /**
     * 设置用户名
     *
     * @param username 用户名
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * 获取姓名
     *
     * @return chname - 姓名
     */
    public String getChname() {
        return chname;
    }

    /**
     * 设置姓名
     *
     * @param chname 姓名
     */
    public void setChname(String chname) {
        this.chname = chname;
    }

    /**
     * 获取联系方式
     *
     * @return phone - 联系方式
     */
    public String getPhone() {
        return phone;
    }

    /**
     * 设置联系方式
     *
     * @param phone 联系方式
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * 获取工作单位
     *
     * @return company - 工作单位
     */
    public String getCompany() {
        return company;
    }

    /**
     * 设置工作单位
     *
     * @param company 工作单位
     */
    public void setCompany(String company) {
        this.company = company;
    }

    /**
     * 获取通讯地址
     *
     * @return address - 通讯地址
     */
    public String getAddress() {
        return address;
    }

    /**
     * 设置通讯地址
     *
     * @param address 通讯地址
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * 获取是否管理员
     *
     * @return is_superuser - 是否管理员
     */
    public Boolean getSuperuser() {
		return superuser;
	}

    /**
     * 设置是否管理员
     *
     * @param isSuperuser 是否管理员
     */
	public void setSuperuser(Boolean superuser) {
		this.superuser = superuser;
	}

    /**
     * 获取创建时间
     *
     * @return gmt_create - 创建时间
     */
    public Date getGmtCreate() {
        return gmtCreate;
    }

	/**
     * 设置创建时间
     *
     * @param gmtCreate 创建时间
     */
    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    /**
     * 获取修改时间
     *
     * @return gmt_modified - 修改时间
     */
    public Date getGmtModified() {
        return gmtModified;
    }

    /**
     * 设置修改时间
     *
     * @param gmtModified 修改时间
     */
    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

	@Override
	public String toString() {
		return "AccountUser [id=" + id + ", username=" + username + ", chname=" + chname + ", phone=" + phone
				+ ", company=" + company + ", address=" + address + ", superuser=" + superuser + ", gmtCreate="
				+ gmtCreate + ", gmtModified=" + gmtModified + "]";
	}
    
}