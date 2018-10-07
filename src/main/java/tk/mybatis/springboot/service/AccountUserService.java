package tk.mybatis.springboot.service;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;

import tk.mybatis.springboot.conf.Constants;
import tk.mybatis.springboot.mapper.AccountUserMapper;
import tk.mybatis.springboot.model.AccountUser;
import tk.mybatis.springboot.service.query.AccountUserQuery;

@Service
public class AccountUserService {
	
	private final AccountUserMapper userMapper;
	
	private final PasswordEncoder passwordEncoder;
	
	public AccountUserService(AccountUserMapper userMapper, PasswordEncoder passwordEncoder) {
		this.userMapper = userMapper;
		this.passwordEncoder = passwordEncoder;
	}

	public List<AccountUser> listPageWithBaseInfo(AccountUserQuery query) {
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
		if (StringUtils.isNotBlank(query.getUsername())) {
			query.setUsername("%" + query.getUsername().trim() + "%");
		} else {
			query.setUsername(null);
		}
		if (StringUtils.isNotBlank(query.getChname())) {
			query.setChname("%" + query.getChname().trim() + "%");
		} else {
			query.setChname(null);
		}
		return userMapper.listAllWithBaseInfo(query);
	}

	public Boolean deleteOneById(Integer id) {
		return userMapper.deleteOneById(id) == 1;
	}

	/**
	 * 管理员创建用户，默认密码
	 * @param user
	 * @return
	 */
	public AccountUser saveOne(AccountUser user) {
		user.setPassword(passwordEncoder.encode(Constants.INITIAL_PASSWORD));
		user.setGmtCreate(new Date());
		user.setGmtModified(new Date());
		return userMapper.insert(user) == 1 ? user : null;
	}
	
	/**
	 * 管理员更新用户
	 * @param user
	 * @return
	 */
	public AccountUser updateOnePartly(AccountUser user) {
		user.setGmtModified(new Date());
		return userMapper.updateByPrimaryKeySelective(user) == 1 ? user : null;
	}
	
	public Boolean checkUsername(String username) {
		return checkUsername((String) null, username);
	}
	
	public Boolean checkUsername(String oldUsername, String username) {
		if (StringUtils.isBlank(username)) {
			return false;
		}
		if (StringUtils.isBlank(oldUsername)) {
			return userMapper.countByUsername(username) == 0;
		}
		if (username.equals(oldUsername)) {
			return true;
		}
		return userMapper.countByUsername(username) == 0;
	}
	
	public Boolean checkUsername(Integer id, String username) {
		List<Integer> ids = userMapper.getIdsByUsername(username);
		if (ids == null || ids.size() == 0) {
			return true;
		}
		for (Integer i : ids) {
			if (id.equals(i)) {
				return true;
			}
		}
		return false;
	}
	
	public Boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= Constants.PASSWORD_MIN_LENGTH &&
            password.length() <= Constants.PASSWORD_MAX_LENGTH;
    }

	public AccountUser registerOne(AccountUser user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setSuperuser(false);
		user.setGmtCreate(new Date());
		user.setGmtModified(new Date());
		return userMapper.insert(user) == 1 ? user : null;
	}

	public AccountUser getOneWithUserInfoById(Integer id) {
		if (id == null) {
			return null;
		}
		return userMapper.getOneWithUserInfoById(id);
	}

	public Boolean validateUserPassword(Integer id, String oldPassword) {
		if (id == null || !checkPasswordLength(oldPassword)) {
			return false;
		}
		String password = userMapper.getPasswordById(id);
		return passwordEncoder.matches(oldPassword, password);
	}

	public Boolean updateUserPassword(Integer id, String newPassword) {
		if (id == null || !checkPasswordLength(newPassword)) {
			return false;
		}
		return userMapper.updatePasswordById(id, passwordEncoder.encode(newPassword)) == 1;
	}
	
}
