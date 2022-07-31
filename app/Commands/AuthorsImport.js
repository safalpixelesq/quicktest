"use strict";

const { Command } = require("@adonisjs/ace");
const fs = require("fs");
const EntryService = use("Entry");
const CollectionModel = use("App/Models/Collection");
const EntryModel = use("App/Models/Entry");
const UserModel = use("App/Models/User");

class AuthorsImport extends Command {
	static get signature() {
		return "authors:import { collectionSlug: Collection to import to} {projectName : Project directory name } { filePath : Json path to import }";
	}

	async handle(args, options) {
		try {
			const { collectionSlug, projectName, filePath } = args;
			let config = await this.readFile(
				`./resources/imports/${projectName}/config.json`,
				"utf-8"
			);
			config = JSON.parse(config);

			let authorList = await fs.readFileSync(
				`./resources/imports/${projectName}/${filePath}`,
				"utf8"
			);
			authorList = JSON.parse(authorList);

			const collection = await CollectionModel.query()
				.where("slug", collectionSlug)
				.where("deleted", false)
				.with("project")
				.fetch();

			const project = await collection.rows[0].project().fetch();
			const user = await UserModel.find(config.author_id);

			for (const author of authorList) {
				author.slug = `/blog/author/${author.slug}`;
				const existingEntry = await EntryModel.query()
					.where("collection_id", collection.rows[0].id)
					.where("label", author.title)
					.fetch();

				if (existingEntry.rows[0]) {
					console.log("Updating entry ", author.title);
					existingEntry.rows[0].json_content = author;
					await existingEntry.rows[0].save();
				} else {
					console.log("Creating entry ", author.title);
					await EntryService.create(collection.rows[0], {
						entryData: {
							label: author.title,
							json_content: author,
						},
						loggedInUser: user,
						project,
					});
				}
			}

			console.log("Authors import completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}
}

module.exports = AuthorsImport;
