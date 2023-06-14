package com.example.securingweb.controller;

import com.linecorp.line.auth.fido.fido2.common.AuthenticatorAttachment;

public final class ServerPublicKeyCredentialCreationOptionsRequest {
	private final AuthenticatorAttachment authenticatorAttachment = null;
	private final boolean requireResidentKey = false;
	private final String username = null;

	public final AuthenticatorAttachment getAuthenticatorAttachment() {
		return this.authenticatorAttachment;
	}

	public final boolean getRequireResidentKey() {
		return this.requireResidentKey;
	}

	public String getUsername() {
		return username;
	}
}
