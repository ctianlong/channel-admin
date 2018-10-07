package tk.mybatis.springboot.security;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tk.mybatis.springboot.mapper.AccountUserMapper;
import tk.mybatis.springboot.model.AccountUser;


@Service("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {
	
	private final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
	
	private final AccountUserMapper userMapper;
	
	public CustomUserDetailsService(AccountUserMapper userMapper) {
		this.userMapper = userMapper;
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		logger.debug("开始认证账号：{}", username);
		List<AccountUser> users = userMapper.listByUsernameOnLogin(username);
		if(users == null || users.size() == 0) {
			logger.debug("账号不存在：{}", username);
			throw new UsernameNotFoundException("该账号不存在");
		} else if(users.size() > 1) {
			logger.debug("账号用户名重复：{}", username);
			throw new UsernameNotFoundException("账号用户名重复");
		} else {
			AccountUser user = users.get(0);
			logger.debug("账号存在：{}", username);
			Set<GrantedAuthority> auth = new HashSet<>();
			if(user.getSuperuser()) {
				auth.add(new SimpleGrantedAuthority(RoleConstants.ADMIN));
			} else {
				auth.add(new SimpleGrantedAuthority(RoleConstants.USER));
			}
			return new SecurityUser(user.getId(), username, user.getPassword(), user.getChname(), auth);
		}
	}

}
