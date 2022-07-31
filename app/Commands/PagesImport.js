"use strict";

var glob = require("glob");
const Page = use("App/Models/Page");
const Meta = use("App/Models/Meta");
const Project = use("App/Models/Project");
const { Command } = require("@adonisjs/ace");

class PagesImport extends Command {
	static get signature() {
		return "pages:import  { projectName : Project directory name } { filePath? : Json path to import }";
	}

	async handle(args, options) {
		try {
			const { projectName, filePath } = args;
			let config = await this.readFile(
				`./resources/imports/${projectName}/config.json`,
				"utf-8"
			);
			config = JSON.parse(config);
			const project = await Project.find(config.project_id);

			if (filePath) {
				await this.loadPage(config, project, projectName, filePath);
			} else {
				const files = await glob.sync(
					`./resources/imports/${projectName}/pages/**/*.json`
				);
				for (const file of files) {
					const contents = await this.readFile(file, "utf-8");
					await this.loadPage(
						config,
						project,
						projectName,
						file,
						contents
					);
				}
			}

			console.log("Bulk import operation completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}

	async loadPage(config, project, projectName, filePath) {
		try {
			const rawData = await this.readFile(filePath, "utf-8");
			const pageData = JSON.parse(rawData);
			const regex = new RegExp(
				`\.\/resources\/imports\/${projectName}\/pages(.*)\.json`
			);
			const slug = filePath.match(regex)[1];

			const dupe = await project
				.pages()
				.where("deleted", false)
				.where("slug", slug)
				.fetch();

			if (dupe.rows.length > 0) {
				console.log(`Page ${slug} already exists`);
				return;
			}

			const page = await Page.create({
				slug,
				title: pageData.meta.title,
				author_id: config.author_id,
				project_id: config.project_id,
			});
			const meta = await Meta.create({
				title: pageData.meta.title,
				description: pageData.meta.description,
				image: pageData.meta.image,
				json_ld: pageData.meta.jsonld,
			});
			await page.meta().save(meta);
			await page.revisions().create({
				json_content: pageData.content.map((context) => ({
					context,
					htmlstr: "",
				})),
				author_id: config.author_id,
				published: true,
			});
			console.log(`Loaded page ${filePath}`);
		} catch (error) {
			console.log(`Error loading page ${filePath}. ${error.message}`);
			return;
		}
	}
}

module.exports = PagesImport;
