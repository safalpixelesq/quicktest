"use strict";

const Page = use("App/Models/Page");
const Meta = use("App/Models/Meta");
const Project = use("App/Models/Project");
const { Command } = require("@adonisjs/ace");

class PagesImport extends Command {
	static get signature() {
		return "revision:linker";
	}

	async handle(args, options) {
		try {
			const project = await Project.find(2);
			const pages = await project
				.pages()
				.has("revisions", ">", 1)
				.fetch();

			for (const page of pages.rows) {
				console.log("Linking page ", page.id);
				const revisions = await page
					.revisions()
					.orderBy("created_at", "desc")
					.fetch();

				for (let i = 0; i < revisions.rows.length - 1; i++) {
					const currRevision = revisions.rows[i];
					if (!currRevision.author_id) {
						currRevision.author_id = 1;
					}
					if (!currRevision.previous_revision) {
						currRevision.previous_revision =
							revisions.rows[i + 1].id;
					}
					if (i === 0 && !currRevision.head) {
						currRevision.head = 1;
					}
					await currRevision.save();
				}
			}
		} catch (error) {
			console.log(error);
			return -1;
		}
	}
}

module.exports = PagesImport;
