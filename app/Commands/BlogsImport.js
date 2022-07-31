"use strict";

const Page = use("App/Models/Page");
const { Command } = require("@adonisjs/ace");
const fs = require("fs");
const EntryService = use("Entry");
const CollectionModel = use("App/Models/Collection");
const EntryModel = use("App/Models/Entry");
const UserModel = use("App/Models/User");
const _ = require("lodash");

class BlogsImport extends Command {
	static get signature() {
		return "blogs:import { collectionSlug: Collection to import to} {projectName : Project directory name } { filePath : Json path to import }";
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

			const collection = await CollectionModel.query()
				.where("slug", collectionSlug)
				.where("deleted", false)
				.with("project")
				.fetch();

			const project = await collection.rows[0].project().fetch();
			const user = await UserModel.find(config.author_id);

			for (const blog of blogList) {
				let blogContent = await fs.readFileSync(
					`./resources/imports/${projectName}/collections/blog/${blog.slug}.json`,
					"utf8"
				);
				blogContent = JSON.parse(blogContent);
				blog.content = blogContent.content;
				blog.tags = await this.resolveTagsReference(blog.categories);
				blog.author = await this.resolveAuthorReference(blog.author);
				blog.published = new Date(`${blog.pub_date} ${blog.pub_time}`)
					.toDateString()
					.toUpperCase();
				delete blog.pub_date;
				delete blog.pub_time;
				delete blog.categories;

				const existingEntry = await EntryModel.query()
					.where("collection_id", collection.rows[0].id)
					.where("label", blog.title)
					.fetch();

				if (existingEntry.rows[0]) {
					console.log("Updating entry ", blog.title);
					// existingEntry.rows[0].json_content = blog;
					// await existingEntry.rows[0].save();
					await EntryService.update(collection.rows[0], {
						entryData: { label: blog.title, json_content: blog },
						entryId: existingEntry.rows[0].uuid,
						loggedInUser: user,
						project,
						options: { publishPage: true },
					});
				} else {
					console.log("Creating entry ", blog.title);
					await EntryService.create(collection.rows[0], {
						entryData: { label: blog.title, json_content: blog },
						pageData: {
							slug: `/${collection.rows[0].slug}/${blog.slug}`,
							title: blog.title,
						},
						metaData: {
							title: blog.title,
							description: blog.description,
						},
						themeData: {
							id: config.theme_id,
						},
						loggedInUser: user,
						project,
					});
				}
			}

			console.log("Blogs import completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}

	async resolveAuthorReference(authorName) {
		const authorEntry = await EntryModel.query()
			.where("label", authorName)
			.fetch();
		return authorEntry.rows[0]
			? `$pq_reference_${authorEntry.rows[0].uuid}`
			: "";
	}

	async resolveTagsReference(tags) {
		const refs = [];
		for (let tagLabel of tags.split(",")) {
			const tagEntry = await EntryModel.query()
				.where("label", tagLabel.trim())
				.fetch();

			if (tagEntry.rows[0]) {
				refs.push(`$pq_reference_${tagEntry.rows[0].uuid}`);
			} else {
				console.log("Entry not found", tagLabel);
			}
		}
		return refs;
	}
}

module.exports = BlogsImport;
