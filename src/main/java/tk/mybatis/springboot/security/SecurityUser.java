package tk.mybatis.springboot.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class SecurityUser extends User {

	private static final long serialVersionUID = 1L;
	
	private Integer id;
	
	private String chname;
	
	// 由于用户能够修改用户名，故在该子类中也添加username
	private String username;
	
	public SecurityUser(Integer id, String username, String password, String chname, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
		this.username = username;
		this.id = id;
		this.chname = chname;
	}

	public Integer getId() {
		return id;
	}
	
	public String getChname() {
		return chname;
	}
	
	public void setChname(String chname) {
		this.chname = chname;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
}
