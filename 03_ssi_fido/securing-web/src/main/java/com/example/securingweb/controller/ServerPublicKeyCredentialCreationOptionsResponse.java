package com.example.securingweb.controller;

import java.util.List;

import com.example.securingweb.service.Status;
import com.linecorp.line.auth.fido.fido2.common.AttestationConveyancePreference;
import com.linecorp.line.auth.fido.fido2.common.AuthenticatorSelectionCriteria;
import com.linecorp.line.auth.fido.fido2.common.PublicKeyCredentialParameters;
import com.linecorp.line.auth.fido.fido2.common.PublicKeyCredentialRpEntity;
import com.linecorp.line.auth.fido.fido2.common.extension.AuthenticationExtensionsClientInputs;
import com.linecorp.line.auth.fido.fido2.common.server.RegOptionResponse;
import com.linecorp.line.auth.fido.fido2.common.server.ServerPublicKeyCredentialDescriptor;
import com.linecorp.line.auth.fido.fido2.common.server.ServerPublicKeyCredentialUserEntity;

public final class ServerPublicKeyCredentialCreationOptionsResponse extends AdapterServerResponse {
	
	private final PublicKeyCredentialRpEntity rp;
	
	private final ServerPublicKeyCredentialUserEntity user;
	
	private final AttestationConveyancePreference attestation;
	
	private final AuthenticatorSelectionCriteria authenticatorSelection;
	
	private final String challenge;
	
	private final List<ServerPublicKeyCredentialDescriptor> excludeCredentials;
	
	private final List<PublicKeyCredentialParameters> pubKeyCredParams;
	
	private final Long timeout;
	
	private final AuthenticationExtensionsClientInputs extensions;

	
	public final PublicKeyCredentialRpEntity getRp() {
		return this.rp;
	}

	
	public final ServerPublicKeyCredentialUserEntity getUser() {
		return this.user;
	}

	
	public final AttestationConveyancePreference getAttestation() {
		return this.attestation;
	}

	
	public final AuthenticatorSelectionCriteria getAuthenticatorSelection() {
		return this.authenticatorSelection;
	}

	
	public final String getChallenge() {
		return this.challenge;
	}

	
	public final List<ServerPublicKeyCredentialDescriptor> getExcludeCredentials() {
		return this.excludeCredentials;
	}

	
	public final List<PublicKeyCredentialParameters> getPubKeyCredParams() {
		return this.pubKeyCredParams;
	}

	
	public final Long getTimeout() {
		return this.timeout;
	}

	
	public final AuthenticationExtensionsClientInputs getExtensions() {
		return this.extensions;
	}

	public ServerPublicKeyCredentialCreationOptionsResponse( PublicKeyCredentialRpEntity rp,  ServerPublicKeyCredentialUserEntity user,  AttestationConveyancePreference attestation,  AuthenticatorSelectionCriteria authenticatorSelection,  String challenge,  List<ServerPublicKeyCredentialDescriptor> excludeCredentials,  List<PublicKeyCredentialParameters> pubKeyCredParams,  Long timeout,  AuthenticationExtensionsClientInputs extensions) {
		super(Status.OK, "");
		this.rp = rp;
		this.user = user;
		this.attestation = attestation;
		this.authenticatorSelection = authenticatorSelection;
		this.challenge = challenge;
		this.excludeCredentials = excludeCredentials;
		this.pubKeyCredParams = pubKeyCredParams;
		this.timeout = timeout;
		this.extensions = extensions;
	}

	public ServerPublicKeyCredentialCreationOptionsResponse( Status status, String errorMessage) {
		this((PublicKeyCredentialRpEntity)null, (ServerPublicKeyCredentialUserEntity)null, (AttestationConveyancePreference)null, (AuthenticatorSelectionCriteria)null, (String)null, (List<ServerPublicKeyCredentialDescriptor>)null, (List<PublicKeyCredentialParameters>)null, (Long)null, (AuthenticationExtensionsClientInputs)null);
		this.setStatus(status);
		this.setErrorMessage(errorMessage);
	}

	public ServerPublicKeyCredentialCreationOptionsResponse(RegOptionResponse regOptionResponse) {
		this(regOptionResponse.getRp(), regOptionResponse.getUser(), regOptionResponse.getAttestation(), regOptionResponse.getAuthenticatorSelection(), regOptionResponse.getChallenge(), regOptionResponse.getExcludeCredentials(), regOptionResponse.getPubKeyCredParams(), regOptionResponse.getTimeout(), regOptionResponse.getExtensions());
	}
}
