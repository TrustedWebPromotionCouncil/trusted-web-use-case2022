package com.example.securingweb.controller;

import java.util.List;

import com.example.securingweb.service.Status;
import com.linecorp.line.auth.fido.fido2.common.UserVerificationRequirement;
import com.linecorp.line.auth.fido.fido2.common.extension.AuthenticationExtensionsClientInputs;
import com.linecorp.line.auth.fido.fido2.common.server.AuthOptionResponse;
import com.linecorp.line.auth.fido.fido2.common.server.ServerPublicKeyCredentialDescriptor;
public final class ServerPublicKeyCredentialGetOptionsResponse extends AdapterServerResponse {
	
	private final String challenge;
	
	private final Long timeout;
	
	private final String rpId;
	
	private final List<ServerPublicKeyCredentialDescriptor> allowCredentials;
	
	private final UserVerificationRequirement userVerification;
	
	private final AuthenticationExtensionsClientInputs extensions;

	
	public final String getChallenge() {
		return this.challenge;
	}

	
	public final Long getTimeout() {
		return this.timeout;
	}

	
	public final String getRpId() {
		return this.rpId;
	}

	
	public final List<ServerPublicKeyCredentialDescriptor> getAllowCredentials() {
		return this.allowCredentials;
	}

	
	public final UserVerificationRequirement getUserVerification() {
		return this.userVerification;
	}

	
	public final AuthenticationExtensionsClientInputs getExtensions() {
		return this.extensions;
	}

	public ServerPublicKeyCredentialGetOptionsResponse( String challenge,  Long timeout,  String rpId,  List<ServerPublicKeyCredentialDescriptor> allowCredentials,  UserVerificationRequirement userVerification,  AuthenticationExtensionsClientInputs extensions) {
		super(Status.OK, "");
		this.challenge = challenge;
		this.timeout = timeout;
		this.rpId = rpId;
		this.allowCredentials = allowCredentials;
		this.userVerification = userVerification;
		this.extensions = extensions;
	}

	public ServerPublicKeyCredentialGetOptionsResponse( Status status,  String errorMessage) {
		this((String)null, (Long)null, (String)null, (List<ServerPublicKeyCredentialDescriptor>)null, (UserVerificationRequirement)null, (AuthenticationExtensionsClientInputs)null);
		this.setStatus(status);
		this.setErrorMessage(errorMessage);
	}

	public ServerPublicKeyCredentialGetOptionsResponse( AuthOptionResponse authOptionResponse) {
		this(authOptionResponse.getChallenge(), authOptionResponse.getTimeout(), authOptionResponse.getRpId(), authOptionResponse.getAllowCredentials(), authOptionResponse.getUserVerification(), authOptionResponse.getExtensions());
	}
}
