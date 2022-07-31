"use strict";

var glob = require("glob");
const Partial = use("App/Models/Partial");
const Project = use("App/Models/Project");
const { Command } = require("@adonisjs/ace");

class PagesImport extends Command {
	static get signature() {
		return "partials:import  { projectName : Project directory name }";
	}

	async handle(args, options) {
		try {
			const { projectName } = args;
			let config = await this.readFile(
				`./resources/imports/${projectName}/config.json`,
				"utf-8"
			);
			config = JSON.parse(config);
			const project = await Project.find(config.project_id);
			const files = await glob.sync(
				`./resources/imports/${projectName}/partials/**/*.json`
			);

			for (const file of files) {
				const contents = await this.readFile(file, "utf-8");
				await this.loadPartial(
					config,
					project,
					projectName,
					file,
					contents
				);
			}

			console.log("Bulk import operation completed");
			return;
		} catch (error) {
			console.log(error);
			return -1;
		}
	}

	async loadPartial(config, project, projectName, filePath, rawData) {
		try {
			const partialData = JSON.parse(rawData);
			const regex = new RegExp(
				`\.\/resources\/imports\/${projectName}\/partials/(.*)\.json`
			);
			const name = filePath.match(regex)[1];

			const dupe = await project
				.partials()
				.where("deleted", false)
				.where("name", name)
				.fetch();

			if (dupe.rows.length > 0) {
				console.log(`Partial ${name} already exists`);
				return;
			}

			const partial = await Partial.create({
				name,
				author_id: config.author_id,
				project_id: config.project_id,
				json_content: [
					{
						context: partialData,
						htmlstr: "",
					},
				],
			});

			console.log(`Loaded partial ${filePath}`);
		} catch (error) {
			console.log(`Error loading page ${filePath}. ${error.message}`);
			return;
		}
	}
}

module.exports = PagesImport;
