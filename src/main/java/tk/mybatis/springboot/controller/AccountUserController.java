package tk.mybatis.springboot.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.github.pagehelper.PageInfo;

import tk.mybatis.springboot.model.AccountUser;
import tk.mybatis.springboot.security.SecurityUser;
import tk.mybatis.springboot.security.SecurityUtils;
import tk.mybatis.springboot.service.AccountUserService;
import tk.mybatis.springboot.service.query.AccountUserQuery;

/**
 * 用户管理
 */
@RestController
public class AccountUserController {
	
	private final Logger logger = LoggerFactory.getLogger("USER");

	private final AccountUserService userService;
	
	public AccountUserController(AccountUserService userService) {
		this.userService = userService;
	}

	@GetMapping("/api/users")
	public ResponseEntity<PageInfo<AccountUser>> list(AccountUserQuery query) {
		List<AccountUser> users = userService.listPageWithBaseInfo(query);
		PageInfo<AccountUser> result = new PageInfo<>(users);
		return ResponseEntity.ok().header("x-app-draw", query.getDraw().toString()).body(result);
	}
	
	@PostMapping("/api/users")
	public ResponseEntity<AccountUser> saveOne(@RequestBody @Valid AccountUser user) {
		if (user.getId() != null || user.getSuperuser() == null) {
			return ResponseEntity.badRequest().build();
		}
		if (!userService.checkUsername(user.getUsername())) {
			return ResponseEntity.unprocessableEntity().build();
		}
		AccountUser userAdd = null;
		try {
			userAdd = userService.saveOne(user);
			if (userAdd == null) {
				logger.info("添加用户失败，内部错误，用户名：{}", user.getUsername());
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			};
		} catch (Exception e) {
			logger.info("添加用户失败，内部错误，用户名：{}", user.getUsername());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		logger.info("添加用户成功，用户名：{}", user.getUsername());
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	@PutMapping("/api/users/{id:^\\d+$}")
	public ResponseEntity<AccountUser> updateOnePartly(@PathVariable Integer id, @RequestBody @Valid AccountUser user) {
		if (id.equals(SecurityUtils.getCurrentId()) && user.getSuperuser() != null && !user.getSuperuser()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		if (!userService.checkUsername(id, user.getUsername())) {
			return ResponseEntity.unprocessableEntity().build();
		}
		user.setId(id);
		AccountUser userUpdate = null;
		try {
			userUpdate = userService.updateOnePartly(user);
			if (userUpdate == null) {
				logger.info("修改用户失败，内部错误，用户ID：{}", id);
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			};
		} catch (Exception e) {
			logger.info("修改用户失败，内部错误，用户ID：{}", id);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		logger.info("修改用户成功，用户ID：{}", id);
		if (id.equals(SecurityUtils.getCurrentId())) {
			SecurityUser securityUser = SecurityUtils.getCurrentUser();
			securityUser.setChname(userUpdate.getChname());
			securityUser.setUsername(userUpdate.getUsername());
		}
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	@DeleteMapping("/api/users/{id:^\\d+$}")
	public ResponseEntity<Void> deleteOne(@PathVariable Integer id) {
		if (id.equals(SecurityUtils.getCurrentId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		try {
			if (!userService.deleteOneById(id)) {
				logger.info("删除用户失败，用户不存在，ID：{}", id);
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			logger.info("删除用户失败，ID：{}", id);
			return ResponseEntity.badRequest().build();
		}
		logger.info("删除用户成功，ID：{}", id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/api/common/user/check/username")
	public ResponseEntity<Boolean> checkDuplication(@RequestParam(required = false) String oldUsername, String username) {
		return userService.checkUsername(oldUsername, username) ? ResponseEntity.ok(true) : ResponseEntity.ok(false);
	}
	
	
	@PostMapping("/api/common/user/registerAndLogin")
	public ResponseEntity<Void> registerAndLogin(@RequestBody @Valid AccountUser user) {
		if (!userService.checkPasswordLength(user.getPassword())) {
			return ResponseEntity.badRequest().build();
		}
		if (!userService.checkUsername(user.getUsername())) {
			return ResponseEntity.unprocessableEntity().build();
		}
		AccountUser userRegister = null;
		String rawPassword = user.getPassword();
		try {
			userRegister = userService.registerOne(user);
			if (userRegister == null) {
				logger.info("注册用户失败，内部错误，用户名：{}", user.getUsername());
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			};
		} catch (Exception e) {
			logger.info("注册用户失败，内部错误，用户名：{}", user.getUsername());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		logger.info("注册用户成功，用户名：{}", user.getUsername());
		// 注册后自动登录，此处仅判断自动登录是否抛异常，具体跳转url由前端控制
		try {
			SecurityUtils.login(user.getUsername(), rawPassword);
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/api/user")
	public ResponseEntity<AccountUser> getCurrentUserInfo() {
		AccountUser user = null;
		try {
			user = userService.getOneWithUserInfoById(SecurityUtils.getCurrentId());
			if (user == null) {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		return ResponseEntity.ok(user);
	}
	
	@PutMapping("/api/user")
	public ResponseEntity<AccountUser> updateCurrentUserInfo(@RequestBody @Valid AccountUser user) {
		Integer id = SecurityUtils.getCurrentId();
		if (!userService.checkUsername(id, user.getUsername())) {
			return ResponseEntity.unprocessableEntity().build();
		}
		user.setId(id);
		AccountUser userUpdate = null;
		try {
			userUpdate = userService.updateOnePartly(user);
			if (userUpdate == null) {
				logger.info("修改用户失败，内部错误，用户ID：{}", id);
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			};
		} catch (Exception e) {
			logger.info("修改用户失败，内部错误，用户ID：{}", id);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		logger.info("修改用户成功，用户ID：{}", id);
		SecurityUser securityUser = SecurityUtils.getCurrentUser();
		securityUser.setChname(userUpdate.getChname());
		securityUser.setUsername(userUpdate.getUsername());
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	@PutMapping("/api/user/password")
	public ResponseEntity<Void> updateCurrentUserPassword(@RequestBody Map<String, Object> map) {
		String oldPassword = (String) map.get("oldPassword");
		String newPassword = (String) map.get("newPassword");
		if (!userService.checkPasswordLength(oldPassword) || !userService.checkPasswordLength(newPassword)) {
			return ResponseEntity.badRequest().build();
		}
		Integer id = SecurityUtils.getCurrentId();
		try {
			if (!userService.validateUserPassword(id, oldPassword)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			if (!userService.updateUserPassword(id, newPassword)) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	

}
