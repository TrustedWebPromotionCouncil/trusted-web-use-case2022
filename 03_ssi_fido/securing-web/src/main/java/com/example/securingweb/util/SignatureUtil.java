package com.example.securingweb.util;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.securingweb.entity.RetrieveKeyRequest;
import com.example.securingweb.entity.RetrieveKeyResponse;
import com.example.securingweb.service.Status;
@Service
public final class SignatureUtil {

	private static String aud = "https://dev-fido2yt.com";
	private static String iss = "did:example:21";
	private static String authnCtxFido = "FIDO";
	private static String authnCtxPW = "Password";
	private static String chkAuthnCtx = "PLR";

	private static long expireTime = 1000L * 60 * 60;
	
	// 検証鍵取得用
	private static String url = "http://35.86.230.210:8000/retrieve_key";
	private static String urlBody = "{\"kid\":\"did:example:21#1\"}";

	public String crateTokenFido(String userId) {
		return generateToken(userId,authnCtxFido);
	}
	
	public String crateTokenPW(String userId) {
		return generateToken(userId,authnCtxPW);
	}
	
	private static String generateToken(String userId,String authnCtx){

		// Keyの生成
		RSAPrivateKey privateKey = null;
		RSAPublicKey publicKey = null;

		try {
			privateKey = (RSAPrivateKey)KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(readKey("./key/rsa512.key.pkcs8")));
			publicKey = (RSAPublicKey)KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(readKey("./key/rsa512.pub.key")));
		} catch (InvalidKeySpecException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (NoSuchAlgorithmException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}

		Algorithm algorithm = Algorithm.RSA256(publicKey, privateKey);
		String token = JWT.create()
			.withAudience(aud)	//"aud" : Audience
			.withIssuer(iss)		//"iss" : Issuer
			.withSubject(userId)		 //"sub" : Subject
			.withIssuedAt(new Date())		//"iat" : Issued At
			.withExpiresAt(new Date(new Date().getTime()+expireTime))	//"exp" : Expiration Time
			.withClaim("authnCtx", authnCtx)
			.sign(algorithm);
		
		System.out.println("generate token : " + token);
		
		return token;
	}

	public static String checkToken(String token,Model model,int userMaxLength){

		String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().toUriString();
		// Keyの生成
		RSAPublicKey publicKey = null;

		try {
//			publicKey = (RSAPublicKey)KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(readKey("./key/rsa512.pub.key")));
			publicKey = (RSAPublicKey)KeyFactory.getInstance("RSA").generatePublic(readKeyPost());
		} catch (InvalidKeySpecException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (Exception e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}

		try {
			Algorithm algorithm = Algorithm.RSA256(publicKey,null);
			JWTVerifier verifier = JWT.require(algorithm)
					.withAudience(aud)	//"aud" : Audience
					.withIssuer(iss)		//"iss" : Issuer
					.withClaim("authnCtx", chkAuthnCtx)
					.build();
			DecodedJWT jwt = verifier.verify(token);
			
			System.out.println("decode token : " + jwt.getSubject().toString());

			String userId = jwt.getSubject().toString();
			
			if(userId.length() > userMaxLength) {
				userId = userId.substring(0,userMaxLength);
			}
			
			model.addAttribute("userid", userId);
			
		} catch (JWTVerificationException exception){
			System.out.println("error : " + exception);
			return exception.getMessage();
//			return Status.OK.getValue();
		}

		return Status.OK.getValue();
	}


	/**
	* 鍵ファイルを読み込む
	* @param fileName 読み込み対象ファイル名
	* @return
	*/
	private static byte[] readKey(final String fileName) {

		 byte[] keyBytes = null;

		 try {
				File keyStream = new ClassPathResource(fileName).getFile();


				List<String> line;
				StringBuilder sb = new StringBuilder();
			boolean isContents = false;
			line = Files.readAllLines(keyStream.toPath());
			for (String s : line) {
				if (s.matches("[-]+BEGIN[ A-Z]+[-]+")) {
					//内容がある。内容存在フラグを立てておく。
					isContents = true;
				} else if (s.matches("[-]+END[ A-Z]+[-]+")) {
					 //内容の終了行であるため、ループを抜ける
					 break;
				} else if (isContents) {
					//読み込んだ内容を連結する
					sb.append(s);
				}
			}
			 System.out.println("Key:"+sb);

			keyBytes = Base64.getDecoder().decode(sb.toString());

		 } catch (IOException e) {
			 System.out.println(e.getMessage());
		 }
		 System.out.println("keyBytes:"+keyBytes);

		 return keyBytes;
	}
	
	/**
	* 鍵ファイルをURL経由で読み込む
	* @return
	*/
	private static RSAPublicKeySpec readKeyPost() throws Exception {

		RestTemplate restTemplate = new RestTemplate();
		RetrieveKeyRequest request = new RetrieveKeyRequest();
		request.setKid("did:example:issuer15%231");

		RequestEntity<String> requestEntity = 
				RequestEntity.post(url)
				.contentType(MediaType.APPLICATION_JSON)
				.body(urlBody);
		
		ResponseEntity<RetrieveKeyResponse> response = restTemplate.exchange(requestEntity, RetrieveKeyResponse.class);

		System.out.println(response);
		System.out.println("鍵情報N："+response.getBody().getN());
		System.out.println("鍵情報E："+response.getBody().getE());

		BigInteger modules = new BigInteger(1,Base64.getUrlDecoder().decode(response.getBody().getN()));
		BigInteger publicExponent = new BigInteger(1,Base64.getUrlDecoder().decode(response.getBody().getE()));
		RSAPublicKeySpec publicKeySpec = new RSAPublicKeySpec(modules, publicExponent);
		
		return publicKeySpec;
	}

}
