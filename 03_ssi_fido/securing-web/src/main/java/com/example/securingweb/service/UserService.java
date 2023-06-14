package com.example.securingweb.service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.securingweb.dto.UserRequest;
import com.example.securingweb.entity.LoginUser;
import com.example.securingweb.repository.UserRepository;
/**
 * ユーザー情報 Service
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class UserService {
	/**
	 * ユーザー情報 Repository
	 */
	@Autowired
	UserRepository userRepository;
	/**
	 * ユーザー情報 全検索
	 * @return 検索結果
	 */
	public List<LoginUser> searchAll() {
		return userRepository.findAll();
	}
	/**
	 * ユーザー情報新規登録
	 * @param user ユーザー情報
	 */
	public void create(UserRequest userRequest) {
		userRepository.save(CreateUser(userRequest));
	}
	/**
	 * ユーザーTBLエンティティの生成
	 * @param userRequest ユーザー情報リクエストデータ
	 * @return ユーザーTBLエンティティ
	 */
	private LoginUser CreateUser(UserRequest userRequest) {
		LoginUser user = new LoginUser();
		user.setUserName(userRequest.getName());
		user.setPassword(getHash(userRequest.getPassword()+userRequest.getName()+"TEST12345"));
		return user;
	}
	
	/**
	 * ユーザー認証
	 */
	public boolean login(UserRequest userRequest,NamedParameterJdbcTemplate jdbcTemplate) {

		SqlParameterSource param = new MapSqlParameterSource()
				.addValue("user",userRequest.getName())
				.addValue("pw",getHash(userRequest.getPassword()+userRequest.getName()+"TEST12345"));

		System.out.println("SQLParam : " + param);
		
		int count = jdbcTemplate.queryForObject("SELECT count(*) FROM users WHERE name=:user AND password=:pw",param,Integer.class);

		if(count == 1) {
			return true;
		}
		return false;
	}
	
	/**
	 * 引数で与えた文字列のハッシュ値を取得
	 * @param target
	 * @return
	 */
	private String getHash(String target){
		String hashstr = null;
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] hash = md.digest(target.getBytes());
			BigInteger bi = new BigInteger(1, hash);
			hashstr = String.format("%0" + (hash.length << 1) + "x", bi);

		} catch (NoSuchAlgorithmException e) {
			System.out.println(e.getLocalizedMessage());
		}
		return hashstr;
	}
}