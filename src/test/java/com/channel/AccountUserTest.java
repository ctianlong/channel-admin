package com.channel;

import java.util.Date;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.channel.mapper.AccountUserMapper;
import com.channel.model.AccountUser;
import com.channel.service.query.AccountUserQuery;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AccountUserTest {
	
//	@Autowired
	private AccountUserMapper userMapper;
	
	public static void main(String[] args) {
//		int i = 1222;
//		Integer i2 = new Integer(1222);
//		System.out.println(i == i2);
//		int[] ia = new int[1];
//		Integer[] iaa = new Integer[1];
//		System.out.println(ia);
//		System.out.println(iaa);
//		System.out.println("5~2".split("~")[0]);
//		System.out.println("¥");
//		Double d1 = 1.2e-2;
//		System.out.println(d1);
//		Double d2 = 1.;
//		System.out.println(d2);
//		Double d3 = 0.00000000404168695687693;
//		Double d4 = 0.00000000000000000000005;
//		System.out.println(d3 + d4);
//		System.out.println(0.00000000000000000000001 > 0.0);
		System.out.println(Double.valueOf("0.00000000000000000000001") >= 0.0);
	}
	
	@Test
	public void test1() {
		AccountUser user = new AccountUser();
		user.setAddress("上海");
		user.setChname("张三");
		user.setCompany("同济");
		user.setGmtCreate(new Date());
		user.setGmtModified(new Date());
		user.setPassword("123456");
		user.setPhone("18811112222");
		user.setUsername("admin");
		user.setSuperuser(true);
//		userMapper.insert(user);
//		assertEquals(2, (int) user.getId());
	}
	
	@Test
	public void test2() {
//		System.out.println(userMapper.listByUsernameOnLogin("admin"));
		AccountUserQuery query = new AccountUserQuery();
		query.setUsername("%%");
//		query.setChname("%管理%");
//		query.setSuperuser(false);
//		System.out.println(userMapper.listAllWithBaseInfo(query));
	}

}
