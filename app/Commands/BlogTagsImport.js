"use strict";

const { Command } = require("@adonisjs/ace");
const fs = require("fs");
const EntryService = use("Entry");
const CollectionModel = use("App/Models/Collection");
const EntryModel = use("App/Models/Entry");
const UserModel = use("App/Models/User");
const _ = require("lodash");
class BlogTagsImport extends Command {
	static get signature() {
		return "blog-tags:import { collectionSlug: Collection to import to} {projectName : Project directory name } { filePath : Json path to import }";
	}

	async handle(args, options) {
		try {
			const { collectionSlug, projectName, filePath } = args;
			let config = await this.readFile(
				`./resources/imports/${projectName}/config.json`,
				"utf-8"
			);
			config = JSON.parse(config);

			let blogList = await fs.readFileSync(
				`./resources/imports/${projectName}/${filePath}`,
				"utf8"
			);
			blogList = JSON.parse(blogList);
			const tagList = blogList
				.map((blog) =>
					blog.categories.split(",").map((c) => ({
						label: c.trim(),
						slug: `${this.string_to_slug(c)}`,
					}))
				)
				.flat();

			const uniqueTags = _.uniqBy(tagList, "slug");

			const collection = await CollectionModel.query()
				.where("slug", collectionSlug)
				.where("deleted", false)
				.with("project")
				.fetch();

			const project = await collection.rows[0].project().fetch();
			const user = await UserModel.find(config.author_id);

			for (const tag of uniqueTags) {
				tag.slug = `/blog/category/${tag.slug}`;
				const existingEntry = await EntryModel.query()
					.where("collection_id", collection.rows[0].id)
					.where("label", tag.label)
					.fetch();

				if (existingEntry.rows[0]) {
					console.log("Updating entry ", tag.label);
					existingEntry.rows[0].json_content = tag;
					await existingEntry.rows[0].save();
				} else {
					console.log("Creating entry ", tag.label);
					await EntryService.create(collection.rows[0], {
						entryData: { label: tag.label, json_content: tag },
						loggedInUser: user,
						project,
					});
				}
			}

			console.log("Blog tags import completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}

	string_to_slug(str) {
		str = str.replace(/^\s+|\s+$/g, ""); // trim
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
		var to = "aaaaeeeeiiiioooouuuunc------";
		for (var i = 0, l = from.length; i < l; i++) {
			str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
		}

		str = str
			.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
			.replace(/\s+/g, "-") // collapse whitespace and replace by -
			.replace(/-+/g, "-"); // collapse dashes

		return str;
	}
}

module.exports = BlogTagsImport;
