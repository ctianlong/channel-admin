package tk.mybatis.springboot.conf;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {

    @Override
	public void addInterceptors(InterceptorRegistry registry) {
	}

    @Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addRedirectViewController("/", "/home/datasum");

		registry.addViewController("/login").setViewName("login");
		registry.addViewController("/users").setViewName("users/list");
		registry.addViewController("/user").setViewName("user/info");
		registry.addViewController("/home/datasum").setViewName("home/datasum");
		registry.addViewController("/home/datacenter").setViewName("home/datacenter");
		registry.addViewController("/home/download").setViewName("home/download");
		registry.addViewController("/home/document").setViewName("home/document");
		registry.addViewController("/channel/list").setViewName("channel/list");
		registry.addViewController("/statistics/channel").setViewName("statistics/channel");
		registry.addViewController("/statistics/day").setViewName("statistics/day");

	}
    
}
