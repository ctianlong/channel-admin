package com.channel.mapper;

import java.util.List;

import com.channel.service.query.AccountUserQuery;
import org.apache.ibatis.annotations.Param;

import com.channel.model.AccountUser;
import com.channel.util.MyMapper;

public interface AccountUserMapper extends MyMapper<AccountUser> {
	
	List<AccountUser> listByUsernameOnLogin(String username);
	
	List<AccountUser> listAllWithBaseInfo(AccountUserQuery accountUserQuery);

	int deleteOneById(Integer id);

	int countByUsername(String username);
	
	List<Integer> getIdsByUsername(String username);

	AccountUser getOneWithUserInfoById(Integer id);

	String getPasswordById(Integer id);

	int updatePasswordById(@Param("id") Integer id, @Param("password") String password);
	
}