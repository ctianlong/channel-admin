package com.channel.service.query;

public class AccountUserQuery extends CommonQuery {

	private String username;

	private String chname;

	private Boolean superuser;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getChname() {
		return chname;
	}

	public void setChname(String chname) {
		this.chname = chname;
	}

	public Boolean getSuperuser() {
		return superuser;
	}

	public void setSuperuser(Boolean superuser) {
		this.superuser = superuser;
	}

	@Override
	public String toString() {
		return "AccountUserQuery{" +
				"username='" + username + '\'' +
				", chname='" + chname + '\'' +
				", superuser=" + superuser +
				"} " + super.toString();
	}
}
