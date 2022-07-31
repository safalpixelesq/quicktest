"use strict";

class PageCreate {
	get rules() {
		return {
			"collectionData.name": "required|min:2|max:256",
			"collectionData.slug": "required|min:2|max:256",
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
