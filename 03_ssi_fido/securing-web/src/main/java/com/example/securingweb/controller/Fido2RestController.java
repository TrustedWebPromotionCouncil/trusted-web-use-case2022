package com.example.securingweb.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.securingweb.service.Attestation;
import com.example.securingweb.service.LineFido2ServerService;
import com.example.securingweb.service.Status;
import com.example.securingweb.util.Fido2Util;

@RestController
public class Fido2RestController {
	private LineFido2ServerService lineFido2ServerService;

	@PostMapping({"/register/option"})
	public ServerPublicKeyCredentialCreationOptionsResponse registerOption(@RequestBody  ServerPublicKeyCredentialCreationOptionsRequest optionsRequest,  HttpServletResponse httpServletResponse) {

		try {
//			User user = Fido2Util.Companion.getLoginUser();
			LineFido2ServerService lineFido2ServerService = this.lineFido2ServerService;
			//画面入力されたUserNameを取得
			String userName = optionsRequest.getUsername();
			Pair registerResponse = lineFido2ServerService.getRegisterOption(userName, optionsRequest.getAuthenticatorAttachment(), optionsRequest.getRequireResidentKey());
			ServerPublicKeyCredentialCreationOptionsResponse serverResponse = (ServerPublicKeyCredentialCreationOptionsResponse)registerResponse.getFirst();
			String sessionId = (String)registerResponse.getSecond();
			Fido2Util.Companion.setFido2SessionId(sessionId, httpServletResponse);
			return serverResponse;
		} catch (Exception msg) {
			return new ServerPublicKeyCredentialCreationOptionsResponse(Status.FAILED,msg.getMessage());
		}
	}

	@PostMapping({"/register/verify"})
	public AdapterServerResponse registerVerify(@RequestBody  Attestation clientResponse,  HttpServletRequest httpServletRequest) {
		String sessionId = Fido2Util.Companion.getFido2SessionId(httpServletRequest);
		if (sessionId == null || sessionId.length() == 0) {
			return new AdapterServerResponse(Status.FAILED, "Cookie not found");
		} else {
			AdapterServerResponse response = null;
			try {
				response = this.lineFido2ServerService.verifyRegisterAttestation(sessionId, clientResponse);
			} catch (Exception msg) {
				return new AdapterServerResponse(Status.FAILED, msg.getMessage());
			}

			return response;
		}
	}

	@PostMapping({"/authenticate/option"})
	public ServerPublicKeyCredentialGetOptionsResponse authenticateOption( HttpServletResponse httpServletResponse,@RequestBody ServerPublicKeyCredentialGetOptionsRequest serverPublicKeyCredentialGetOptionsRequest) {

		try {
//			User user = Fido2Util.Companion.getLoginUser();
			//画面入力されたUserNameを取得
			String userame = serverPublicKeyCredentialGetOptionsRequest.getUsername();
			Pair authenticateResponse = this.lineFido2ServerService.getAuthenticateOption(userame);
			ServerPublicKeyCredentialGetOptionsResponse serverResponse = (ServerPublicKeyCredentialGetOptionsResponse)authenticateResponse.getFirst();
			String sessionId = (String)authenticateResponse.getSecond();
			Fido2Util.Companion.setFido2SessionId(sessionId, httpServletResponse);
			return serverResponse;
		} catch (Exception msg) {
			return new ServerPublicKeyCredentialGetOptionsResponse(Status.FAILED, msg.getMessage());
		}

	}

	public Fido2RestController( LineFido2ServerService lineFido2ServerService) {
		super();
		this.lineFido2ServerService = lineFido2ServerService;
	}
	
}
