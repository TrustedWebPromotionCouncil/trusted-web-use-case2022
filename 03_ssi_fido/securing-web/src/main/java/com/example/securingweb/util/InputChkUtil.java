package com.example.securingweb.util;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import com.example.securingweb.dto.UserRequest;

public final class InputChkUtil{

	public static String chkUserCreate(UserRequest userRequest,NamedParameterJdbcTemplate jdbcTemplate){

		String userId = userRequest.getName();
		String password = userRequest.getPassword();
		
		if(userId.length() == 0) {
			return "ユーザーIDが入力されていません。";
		}

		SqlParameterSource param = new MapSqlParameterSource().addValue("p",userId);
		int count = jdbcTemplate.queryForObject("SELECT count(*) FROM users WHERE name=:p",param,Integer.class);

		if(password.length() < 8) {
			return "パスワードは8文字以上で設定してください。";
		}

		if(count > 0) {
			return "ユーザーIDが既に登録されています。";
		}
		
		return null;
	}
}
