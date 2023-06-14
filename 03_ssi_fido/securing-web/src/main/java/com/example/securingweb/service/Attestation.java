package com.example.securingweb.service;

import com.linecorp.line.auth.fido.fido2.common.Credential;
import com.linecorp.line.auth.fido.fido2.common.extension.AuthenticationExtensionsClientOutputs;
import com.linecorp.line.auth.fido.fido2.common.server.ServerAuthenticatorAttestationResponse;

public final class Attestation extends Credential {
	private final String rawId = "";
	private final ServerAuthenticatorAttestationResponse response = null;
	private final AuthenticationExtensionsClientOutputs extensions = null;

	public final String getRawId() {
		return this.rawId;
	}

	public final ServerAuthenticatorAttestationResponse getResponse() {
		return this.response;
	}

	public final AuthenticationExtensionsClientOutputs getExtensions() {
		return this.extensions;
	}
}
