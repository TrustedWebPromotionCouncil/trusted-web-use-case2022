package com.example.securingweb.controller;

import com.example.securingweb.service.Status;

public class AdapterServerResponse {
	
	private Status status;
	
	private String errorMessage;

	
	public final Status getStatus() {
		return this.status;
	}

	public final void setStatus( Status status) {
		this.status = status;
	}

	public final String getErrorMessage() {
		return this.errorMessage;
	}

	public final void setErrorMessage( String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public AdapterServerResponse( Status status,  String errorMessage) {
		super();
		this.status = status;
		this.errorMessage = errorMessage;
	}
}
