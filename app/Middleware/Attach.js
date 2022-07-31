"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Logger = use("Logger");

class Attach {
	/**
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Function} next
	 */
	async handle({ request, params, auth }, next, properties) {
		try {
			if (properties.includes("project")) {
				const loggedInUser = auth.current.user;

				const project = await loggedInUser
					.projects()
					.where("slug", params.project)
					.where("active", true)
					.fetch();

				request.project = project.rows[0];
			}
			if (properties.includes("collection")) {
				const collection = await request.project
					.collections()
					.where("slug", params.collection)
					.where("deleted", false)
					.fetch();

				request.collection = collection.rows[0];
			}
		} catch (error) {
			Logger.error("Attach middleware error: ", error);
		}
		// call next to advance the request
		await next();
	}
}

module.exports = Attach;
