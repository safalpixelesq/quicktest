"use strict";

const Page = use("App/Models/Page");
const { Command } = require("@adonisjs/ace");

class PagesImport extends Command {
	static get signature() {
		return "pages:title-fill";
	}

	async handle(args, options) {
		try {
			let pages = await Page.query().with("meta").fetch();
			pages = pages.toJSON();

			for (let page of pages) {
				await Page.query()
					.where("id", page.id)
					.update({ title: page.meta.title });
			}

			console.log("Title update operation completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}
}

module.exports = PagesImport;
