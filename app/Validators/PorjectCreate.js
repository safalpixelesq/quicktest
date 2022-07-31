'use strict'

class PorjectCreate {
	get rules() {
		return {
			name:'required|min:2',
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
			"name.min":"Must be atleast 2 characters",
		};
	}
}

module.exports = PorjectCreate
