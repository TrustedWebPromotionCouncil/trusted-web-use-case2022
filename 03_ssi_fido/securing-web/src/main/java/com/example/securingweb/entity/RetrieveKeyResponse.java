package com.example.securingweb.entity;

public class RetrieveKeyResponse {

	private String e;
	private String n;
	private String kid;
	private String kty;

	public String getE() {
		return e;
	}

	public void setE(String e) {
		this.e = e;
	}

	public String getN() {
		return n;
	}

	public void setN(String n) {
		this.n = n;
	}

	public String getKty() {
		return kty;
	}

	public void setKty(String kty) {
		this.kty = kty;
	}


	public String getKid() {
		return kid;
	}

	public void setKid(String kid) {
		this.kid = kid;
	}

}
