package com.channel.conf;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.channel.security.RoleConstants;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AbstractAuthenticationTargetUrlRequestHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	
	private final UserDetailsService userDetailsService;
	
	public WebSecurityConfig(AuthenticationManagerBuilder authenticationManagerBuilder, UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
		this.authenticationManagerBuilder = authenticationManagerBuilder;
	}
	
	@PostConstruct
    public void init() {
        try {
            authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                    .passwordEncoder(passwordEncoder());
        } catch (Exception e) {
            throw new BeanInitializationException("Security configuration failed", e);
        }
    }
	
	@Bean
    public AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler() {
        return new AjaxAuthenticationSuccessHandler();
    }
	
	@Bean
    public AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler() {
        return new AjaxAuthenticationFailureHandler();
    }

    @Bean
    public AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler() {
        return new AjaxLogoutSuccessHandler();
    }
    
    @Bean
    public MyHttp401UnauthorizedEntryPoint myHttp401UnauthorizedEntryPoint() {
        return new MyHttp401UnauthorizedEntryPoint();
    }
    
    @Bean
    public MyHttp403ForbiddenEntryPoint myHttp403ForbiddenEntryPoint() {
    	return new MyHttp403ForbiddenEntryPoint();
    }
    
    @Override
    public void configure(WebSecurity web) throws Exception {
    	//用于允许static目录下的静态资源访问，
    	web.ignoring()
    		.antMatchers("/js/**", "/css/**", "/img/**", "/fonts/**")
    		.antMatchers("/druid/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	http
    		.authorizeRequests()
            .antMatchers("/api/channel/list").authenticated()
            .regexMatchers("(/api)?/(users|channel|statistics).*").hasAuthority(RoleConstants.ADMIN)
	        .antMatchers("/api/common/**").permitAll()
    		.anyRequest().authenticated()
    	.and()
    		.formLogin()
			.loginPage("/login")
			.loginProcessingUrl("/api/common/user/login")
			.successHandler(ajaxAuthenticationSuccessHandler())
			.failureHandler(ajaxAuthenticationFailureHandler())
			.permitAll()
		.and()
			.logout()
    		.logoutUrl("/api/common/user/logout")
    		.logoutSuccessHandler(ajaxLogoutSuccessHandler())
    		.permitAll()
    	.and()
    		.exceptionHandling()
    		.authenticationEntryPoint(myHttp401UnauthorizedEntryPoint());
//    		.accessDeniedHandler(myHttp403ForbiddenEntryPoint()); //不配置也能处理ajax，对没有权限的ajax请求返回403
//        	.csrf()
//        		.disable();  //关闭跨站请求伪造保护
        		
	}
    
    protected boolean isAjax(HttpServletRequest request) {
        return StringUtils.isNotBlank(request.getHeader("X-Requested-With"));
    }
    
    private class AjaxAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    	@Override
    	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
    			Authentication authentication) throws IOException, ServletException {
    		response.setStatus(HttpServletResponse.SC_OK);
    	}
    }
    
    private class AjaxAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    	@Override
    	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
    			AuthenticationException exception) throws IOException, ServletException {
    		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
    	}
    }
    
	private class AjaxLogoutSuccessHandler extends AbstractAuthenticationTargetUrlRequestHandler
			implements LogoutSuccessHandler {
		@Override
		public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
				Authentication authentication) throws IOException, ServletException {
			response.setStatus(HttpServletResponse.SC_OK);
		}
	}
	
	private class MyHttp401UnauthorizedEntryPoint implements AuthenticationEntryPoint {
	    @Override
	    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException arg2)
	        throws IOException,
	        ServletException {
	    	if (isAjax(request)) {
	    		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No Authentication");
            } else {
                response.sendRedirect("/login");
            }
	    }
	}
	
	private class MyHttp403ForbiddenEntryPoint implements AccessDeniedHandler {
		@Override
		public void handle(HttpServletRequest request, HttpServletResponse response,
				AccessDeniedException accessDeniedException) throws IOException, ServletException {
			if (isAjax(request)) {
				response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
            } else {
            	response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied"); // 非ajax情况下，springboot会根据错误码自动找错误页面
//                response.sendRedirect("/403"); // 若没有在MVC中显式配置/403的映射，则会找不到页面
            }
		}
	}
    
    @Bean
    public PasswordEncoder passwordEncoder(){
    	return new BCryptPasswordEncoder();
    }
    
}
