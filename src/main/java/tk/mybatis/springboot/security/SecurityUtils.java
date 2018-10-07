package tk.mybatis.springboot.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Utility class for Spring Security.
 */
@Component
public class SecurityUtils {
	
	private static AuthenticationManager authenticationManager;
	
	@Autowired
	public void setAuthenticationManager(AuthenticationManager authenticationManager) {
		SecurityUtils.authenticationManager = authenticationManager;
	}

    /**
     * get current user
     * @return
     */
    public static SecurityUser getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null){
        	return (SecurityUser) authentication.getPrincipal();
        }
        return null;
    }
    
    /**
     * Get the uid of the current user.
     *
     * @return the login of the current user
     */
    public static Integer getCurrentId() {
    	SecurityUser user = getCurrentUser();
        return user == null ? null : user.getId();
    }

    /**
     * Get the username of the current user.
     *
     * @return the login of the current user
     */
    public static String getCurrentUsername() {
    	SecurityUser user = getCurrentUser();
        return user == null ? null : user.getUsername();
    }

    /**
     * Check if a user is authenticated.
     *
     * @return true if the user is authenticated, false otherwise
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null){
        	return authentication.isAuthenticated();
        }
        return false;
    }

    /**
     * If the current user has a specific authority (security role).
     *
     * <p>The name of this method comes from the isUserInRole() method in the Servlet API</p>
     *
     * @param authority the authority to check
     * @return true if the current user has the authority, false otherwise
     */
    public static boolean isCurrentUserInRole(String authority) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(authority));
        }
        return false;
    }
    
    /**
     * 手动登录方式，不通过 form-post-login，若登录成功，返回之前用户访问的url（或者默认url）
     * 若登录失败，抛异常AuthenticationException
     * @param username
     * @param password
     * @return 登陆后需要重定向的 URL
     */
    public static String loginReturnUrl(String username, String password) {
    	HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
		String defaultTargetUrl = "/"; // 默认登陆成功的页面
		String redirectUrl = "/login?error";
		try {
			login(username, password);
			// 重定向到登陆前的页面
			SavedRequest savedRequest = new HttpSessionRequestCache().getRequest(request, response);
			redirectUrl = (savedRequest != null) ? savedRequest.getRedirectUrl() : defaultTargetUrl;
		} catch (AuthenticationException e) {
			System.out.println(e.getMessage());
		}
    	return redirectUrl;
    }
    
    /**
     * 手动登录，不通过 form-post-login，若登录失败抛异常AuthenticationException
     * @param username
     * @param password
     */
    public static void login(String username, String password) throws AuthenticationException {
    	UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
//		token.setDetails(new WebAuthenticationDetails(request)); // 经测试，可不加
    	Authentication authentication = authenticationManager.authenticate(token); // 登陆
        SecurityContextHolder.getContext().setAuthentication(authentication);
//		request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext()); // 经测试，可不加
    }
}
