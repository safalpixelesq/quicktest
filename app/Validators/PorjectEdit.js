"use strict";

class PorjectEdit {
	get rules() {
		return {
			name: "min:2",
			"setting.integration.type": "in:NETLIFY,SSH",
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
			"name.min": "Must be atleast 2 characters",
		};
	}
}

module.exports = PorjectEdit;
