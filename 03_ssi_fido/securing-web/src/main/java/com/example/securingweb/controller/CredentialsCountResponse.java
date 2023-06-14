package com.example.securingweb.controller;

import com.example.securingweb.service.Status;
public final class CredentialsCountResponse extends AdapterServerResponse {
	private final Integer count;

	public final Integer getCount() {
		return this.count;
	}

	public CredentialsCountResponse( Integer count) {
		super(Status.OK, "");
		this.count = count;
	}

	public CredentialsCountResponse(Status status, String errorMessage) {
		this(0);
		this.setStatus(status);
		this.setErrorMessage(errorMessage);
	}
}
