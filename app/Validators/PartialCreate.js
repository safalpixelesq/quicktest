"use strict";

class PartialCreate {
	get rules() {
		return {
			"partialData.name": "required|min:2|max:256",
			projectID: "required|number",
		};
	}
	async fails(errors) {
		return this.ctx.response.status(400).json({
			message: "Error validating request",
			errors,
		});
	}
}

module.exports = PartialCreate;
