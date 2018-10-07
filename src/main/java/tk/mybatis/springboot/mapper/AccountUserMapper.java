package tk.mybatis.springboot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import tk.mybatis.springboot.model.AccountUser;
import tk.mybatis.springboot.service.query.AccountUserQuery;
import tk.mybatis.springboot.util.MyMapper;

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