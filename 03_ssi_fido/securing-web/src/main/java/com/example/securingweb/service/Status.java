package com.example.securingweb.service;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
	OK("ok"),
	FAILED("failed");

	@JsonValue
	private final String value;

	public final String getValue() {
		return this.value;
	}

	private Status(String value) {
		this.value = value;
	}
}
