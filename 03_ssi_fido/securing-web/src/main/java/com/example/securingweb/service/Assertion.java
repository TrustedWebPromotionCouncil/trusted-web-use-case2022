package com.example.securingweb.service;

import com.linecorp.line.auth.fido.fido2.common.Credential;
import com.linecorp.line.auth.fido.fido2.common.extension.AuthenticationExtensionsClientOutputs;
import com.linecorp.line.auth.fido.fido2.common.server.ServerAuthenticatorAssertionResponse;

public final class Assertion extends Credential {
	private final String rawId = "";
	private final ServerAuthenticatorAssertionResponse response = null;
	private final AuthenticationExtensionsClientOutputs extensions = null;

	public final String getRawId() {
		return this.rawId;
	}

	public final ServerAuthenticatorAssertionResponse getResponse() {
		return this.response;
	}

	public final AuthenticationExtensionsClientOutputs getExtensions() {
		return this.extensions;
	}
}
