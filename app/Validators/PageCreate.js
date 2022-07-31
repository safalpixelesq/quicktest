"use strict";

class PageCreate {
	get rules() {
		return {
			"meta.title": "required|min:2|max:256",
			"meta.description": "max:500",
			"page.slug": "required",
		};
	}
	async fails(errors) {
		return this.ctx.response.status(400).json({
			message: "Error validating request",
			errors,
		});
	}
}

module.exports = PageCreate;
