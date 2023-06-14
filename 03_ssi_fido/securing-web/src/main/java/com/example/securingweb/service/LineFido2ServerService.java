package com.example.securingweb.service;

import java.util.List;

import org.springframework.data.util.Pair;

import com.example.securingweb.controller.AdapterServerResponse;
import com.linecorp.line.auth.fido.fido2.common.AuthenticatorAttachment;
import com.linecorp.line.auth.fido.fido2.common.server.ServerUserKey;

public interface LineFido2ServerService {
	Pair getRegisterOption( String userName, AuthenticatorAttachment authenticatorAttachment, boolean requireResidentKey);

	AdapterServerResponse verifyRegisterAttestation( String userName,  Attestation authenticatorAttachment);

	Pair getAuthenticateOption( String userName);

	boolean verifyAuthenticateAssertion( String userName, Assertion authenticatorAttachment);

	List<ServerUserKey> getCredentialsWithUsername( String userName);

	ServerUserKey getCredentialWithCredentialId( String userName);
}
