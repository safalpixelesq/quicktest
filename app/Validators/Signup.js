"use strict";

class Signup {
	get rules() {
		return {
			name:'required',
			email:'required|email|unique:users',
			password:'required|min:8'
		};
	}
	async fails(errors) {
		return this.ctx.response.status(400).json({
			message: "Error validating request",
			errors,
		});
	}
	get messages() {
		return {
			"name.required":"Name is required",
			"email.required": "Email is required",
			"email.email": "Enter a valid email address",
			"email.unique": "An account already exists with that email",
			"password.required":"Password is required",
			"password.min":"Must at least have 8 characters"
		};
	}
}

module.exports = Signup;
