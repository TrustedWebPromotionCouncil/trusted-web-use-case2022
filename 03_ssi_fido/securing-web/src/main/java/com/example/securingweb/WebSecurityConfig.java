package com.example.securingweb;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	//フォームの値と比較するDBから取得したパスワードは暗号化されているのでフォームの値も暗号化するために利用
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
		return bCryptPasswordEncoder;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests((requests) -> requests
					 .antMatchers("/","/login","/pwlogin", "/home", "/add", "/list", "/create", "/ok","/login-redirect", "/js/**","/register/**","/authenticate/option").permitAll()
					 .antMatchers("/login","/pwlogin").hasRole("user")
					 .antMatchers("/login","/pwlogin").hasRole("token")
					 .antMatchers("/login","/pwlogin").hasRole("url")
					 .antMatchers("/authenticate/option").hasRole("username")
					 .anyRequest().authenticated()
				)
				.formLogin((form) -> form
						.loginPage("/login")
						.failureUrl("/login")
					 .permitAll()
				)
				.logout((logout) -> logout.permitAll());
			http.csrf().disable();
			http.headers().frameOptions().disable();
		return http.build();
	}

}
