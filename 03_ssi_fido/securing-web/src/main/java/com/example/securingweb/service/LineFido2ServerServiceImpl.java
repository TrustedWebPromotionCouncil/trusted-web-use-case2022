package com.example.securingweb.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import org.springframework.data.util.Pair;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.securingweb.controller.AdapterServerResponse;
import com.example.securingweb.controller.ServerPublicKeyCredentialCreationOptionsResponse;
import com.example.securingweb.controller.ServerPublicKeyCredentialGetOptionsResponse;
import com.linecorp.line.auth.fido.fido2.common.AttestationConveyancePreference;
import com.linecorp.line.auth.fido.fido2.common.AuthenticatorAttachment;
import com.linecorp.line.auth.fido.fido2.common.AuthenticatorSelectionCriteria;
import com.linecorp.line.auth.fido.fido2.common.PublicKeyCredentialRpEntity;
import com.linecorp.line.auth.fido.fido2.common.UserVerificationRequirement;
import com.linecorp.line.auth.fido.fido2.common.crypto.Digests;
import com.linecorp.line.auth.fido.fido2.common.extension.CredProtect;
import com.linecorp.line.auth.fido.fido2.common.server.AuthOptionRequest;
import com.linecorp.line.auth.fido.fido2.common.server.AuthOptionResponse;
import com.linecorp.line.auth.fido.fido2.common.server.GetCredentialResult;
import com.linecorp.line.auth.fido.fido2.common.server.GetCredentialsResult;
import com.linecorp.line.auth.fido.fido2.common.server.RegOptionRequest;
import com.linecorp.line.auth.fido.fido2.common.server.RegOptionResponse;
import com.linecorp.line.auth.fido.fido2.common.server.RegisterCredential;
import com.linecorp.line.auth.fido.fido2.common.server.RegisterCredentialResult;
import com.linecorp.line.auth.fido.fido2.common.server.ServerAuthPublicKeyCredential;
import com.linecorp.line.auth.fido.fido2.common.server.ServerPublicKeyCredentialUserEntity;
import com.linecorp.line.auth.fido.fido2.common.server.ServerRegPublicKeyCredential;
import com.linecorp.line.auth.fido.fido2.common.server.ServerResponse;
import com.linecorp.line.auth.fido.fido2.common.server.ServerUserKey;
import com.linecorp.line.auth.fido.fido2.common.server.VerifyCredential;
import com.linecorp.line.auth.fido.fido2.common.server.VerifyCredentialResult;

@Service
public class LineFido2ServerServiceImpl implements LineFido2ServerService {
	private final RestTemplate restTemplate;
	private static final String RP_NAME = "LINE-FIDO2-Server Spring-Security--App";

//	private static final String RP_ID = "localhost";
//	private static final String ORIGIN = "http://localhost:8080";
	private static final String RP_ID = "dev-fido2yt.com";
	private static final String ORIGIN = "https://dev-fido2yt.com";

	private static final String FIDO_URI = "http://54.202.220.116/fido2";
	
	public static final Companion Companion = new Companion();

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Pair<ServerPublicKeyCredentialCreationOptionsResponse, String> getRegisterOption( String userName,  AuthenticatorAttachment authenticatorAttachment, boolean requireResidentKey) {
		PublicKeyCredentialRpEntity rp = new PublicKeyCredentialRpEntity();
		rp.setId(RP_ID);
		rp.setName(RP_NAME);
		ServerPublicKeyCredentialUserEntity user = new ServerPublicKeyCredentialUserEntity();
		user.setName(userName);
		user.setId(this.createUserId(userName));
		user.setDisplayName(RP_NAME + userName);
		AuthenticatorSelectionCriteria authenticatorSelection = new AuthenticatorSelectionCriteria();
		authenticatorSelection.setAuthenticatorAttachment(authenticatorAttachment);
		authenticatorSelection.setRequireResidentKey(requireResidentKey);
		authenticatorSelection.setUserVerification(UserVerificationRequirement.REQUIRED);
		RegOptionRequest regOptionRequest = RegOptionRequest.builder().rp(rp).user(user).authenticatorSelection(authenticatorSelection).attestation(AttestationConveyancePreference.none).credProtect(new CredProtect()).build();
		HttpEntity request = new HttpEntity(regOptionRequest, (MultiValueMap)(new HttpHeaders()));
		RegOptionResponse response = (RegOptionResponse)this.restTemplate.postForObject(FIDO_URI+"/reg/challenge", request, RegOptionResponse.class, new Object[0]);
		return Pair.of(new ServerPublicKeyCredentialCreationOptionsResponse(response), response.getSessionId());
	}

	public AdapterServerResponse verifyRegisterAttestation( String sessionId,  Attestation clientResponse) {

		System.out.println("sessionId Attestation : " + sessionId);
		ServerRegPublicKeyCredential serverRegPublicKeyCredential = new ServerRegPublicKeyCredential();
		serverRegPublicKeyCredential.setId(clientResponse.getId());
		serverRegPublicKeyCredential.setType(clientResponse.getType());
		serverRegPublicKeyCredential.setResponse(clientResponse.getResponse());
		serverRegPublicKeyCredential.setExtensions(clientResponse.getExtensions());
		RegisterCredential registerCredential = new RegisterCredential();
		registerCredential.setServerPublicKeyCredential(serverRegPublicKeyCredential);
		registerCredential.setRpId(RP_ID);
		registerCredential.setSessionId(sessionId);
		registerCredential.setOrigin(ORIGIN);
		System.out.println("verify registerCredential : " + registerCredential);
		HttpEntity<RegisterCredential> request = new HttpEntity<>(registerCredential,new HttpHeaders());
		System.out.println("verify request : " + request);
		this.restTemplate.postForObject(FIDO_URI+"/reg/response", request, RegisterCredentialResult.class, new Object[0]);

		System.out.println("verify request : OK");
		return new AdapterServerResponse(Status.OK, "");
	}

	
	public Pair getAuthenticateOption( String userName) {
		CharSequence seqUserName = (CharSequence)userName;
		AuthOptionRequest AORequest;
		if (seqUserName == null || seqUserName.length() == 0) {
	 	  AORequest = AuthOptionRequest.builder().rpId(RP_ID).userVerification(UserVerificationRequirement.REQUIRED).build();
		} else {
			AORequest = AuthOptionRequest.builder().rpId(RP_ID).userId(this.createUserId(userName)).userVerification(UserVerificationRequirement.DISCOURAGED).build();
		}

		AuthOptionResponse response;
		Integer errorCode;
		label32: {
			AuthOptionRequest authOptionRequest = AORequest;
			HttpEntity<AuthOptionRequest> request = new HttpEntity<>(authOptionRequest,new HttpHeaders());
			response = (AuthOptionResponse)this.restTemplate.postForObject(FIDO_URI+"/auth/challenge", request, AuthOptionResponse.class, new Object[0]);
			if (response != null) {
				ServerResponse res = response.getServerResponse();
				if (res != null) {
					errorCode = res.getInternalErrorCode();
					break label32;
				}
			}
			errorCode = null;
		}

		if (errorCode != null) {
			if (errorCode == 0) {
				return Pair.of(new ServerPublicKeyCredentialGetOptionsResponse(response), response.getSessionId());
			}
		}

		ServerResponse res = response != null ? response.getServerResponse() : null;
		return Pair.of(new ServerPublicKeyCredentialGetOptionsResponse(Status.FAILED, res.getInternalErrorCodeDescription()), "");
	}

	public boolean verifyAuthenticateAssertion( String sessionId,  Assertion assertion) {

		System.out.println("sessionId Assertion : " + sessionId);
	  ServerAuthPublicKeyCredential serverAuthPublicKeyCredential = new ServerAuthPublicKeyCredential();
	  serverAuthPublicKeyCredential.setResponse(assertion.getResponse());
	  serverAuthPublicKeyCredential.setId(assertion.getId());
	  serverAuthPublicKeyCredential.setType(assertion.getType());
	  serverAuthPublicKeyCredential.setExtensions(assertion.getExtensions());
	  VerifyCredential verifyCredential = new VerifyCredential();
	  verifyCredential.setServerPublicKeyCredential(serverAuthPublicKeyCredential);
	  verifyCredential.setRpId(RP_ID);
	  verifyCredential.setSessionId(sessionId);
	  verifyCredential.setOrigin(ORIGIN);
	  HttpEntity request = new HttpEntity(verifyCredential, (MultiValueMap)(new HttpHeaders()));

		System.out.println("verify request : " + request);
		try {
		  this.restTemplate.postForObject(FIDO_URI+"/auth/response", request, VerifyCredentialResult.class, new Object[0]);
		  return true;
		} catch (Exception err) {
	 	  return false;
		}

	}

	public List getCredentialsWithUsername( String username) {
		String userId = this.createUserId(username);
		UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(FIDO_URI+"/credentials/");
		URI uri = uriComponentsBuilder.queryParam("rpId", new Object[]{RP_ID}).queryParam("userId", new Object[]{userId}).build().toUri();
		ResponseEntity response = this.restTemplate.exchange(uri, HttpMethod.GET, (HttpEntity)null, GetCredentialsResult.class);
		return ((GetCredentialsResult)response.getBody()).getCredentials();
	}

	public ServerUserKey getCredentialWithCredentialId( String credentialId) {
		UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(FIDO_URI+"/credentials/");
		URI uri = uriComponentsBuilder.path(credentialId).queryParam("rpId", new Object[]{RP_ID}).build().toUri();
		ResponseEntity response = this.restTemplate.exchange(uri, HttpMethod.GET, (HttpEntity)null, GetCredentialResult.class);
		return ((GetCredentialResult)response.getBody()).getCredential();
	}

	private String createUserId(String username) {
		byte[] digest = Digests.sha256(username.getBytes(StandardCharsets.UTF_8));
		return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
	}

	public LineFido2ServerServiceImpl( RestTemplate restTemplate) {
		super();
		this.restTemplate = restTemplate;
	}

	public static final class Companion {
	  public Companion() {
		}

	}
}
