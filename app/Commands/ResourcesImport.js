"use strict";

const { Command } = require("@adonisjs/ace");
const fs = require("fs");
const EntryService = use("Entry");
const CollectionModel = use("App/Models/Collection");
const EntryModel = use("App/Models/Entry");
const UserModel = use("App/Models/User");
const _ = require("lodash");
class ResourcesImport extends Command {
	static get signature() {
		return "resources:import { collectionSlug: Collection to import to} {projectName : Project directory name } { filePath : Json path to import }";
	}

	async handle(args, options) {
		try {
			const { collectionSlug, projectName, filePath } = args;
			let config = await this.readFile(
				`./resources/imports/${projectName}/config.json`,
				"utf-8"
			);
			config = JSON.parse(config);

			let resourceList = await fs.readFileSync(
				`./resources/imports/${projectName}/${filePath}`,
				"utf8"
			);
			resourceList = JSON.parse(resourceList);

			const collection = await CollectionModel.query()
				.where("slug", collectionSlug)
				.where("deleted", false)
				.with("project")
				.fetch();

			const project = await collection.rows[0].project().fetch();
			const user = await UserModel.find(config.author_id);

			for (const resource of resourceList) {
				resource.type = await this.resolveTypeReference(resource.type);
				delete resource.cta.external;
				delete resource.cta.label;

				const existingEntry = await EntryModel.query()
					.where("collection_id", collection.rows[0].id)
					.where("label", resource.title)
					.fetch();

				if (existingEntry.rows[0]) {
					console.log("Updating entry ", resource.title);
					existingEntry.rows[0].json_content = resource;
					await existingEntry.rows[0].save();
				} else {
					console.log("Creating entry ", resource.title);
					await EntryService.create(collection.rows[0], {
						entryData: {
							label: resource.title,
							json_content: resource,
						},
						loggedInUser: user,
						project,
					});
				}
			}

			console.log("Resources import completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}

	async resolveTypeReference(typeSlug) {
		const typeEntry = await EntryModel.query()
			.where("label", _.startCase(_.toLower(typeSlug)))
			.fetch();

		return typeEntry.rows[0]
			? `$pq_reference_${typeEntry.rows[0].uuid}`
			: "";
	}
}

module.exports = ResourcesImport;
