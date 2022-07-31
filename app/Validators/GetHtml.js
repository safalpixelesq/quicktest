'use strict'

class GetHtml {
	get rules() {
		return {
			content:'required|array',
			
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
			"content.required":"Content array is required",
			"content.array":"Must be an array of modules/section",
		};
	}
}

module.exports = GetHtml
