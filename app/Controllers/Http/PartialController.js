"use strict";

const Logger = use("Logger");
const slugify = require("slugify");
const Partial = use("App/Models/Partial");
const Project = use("App/Models/Project");
const PageService = use("Page");
class PartialController {
	async index({ request, response }) {
		try {
			const { projectID } = request.get();
			const project = await Project.find(projectID);
			const partials = await project.partials().with("author").fetch();

			return response.status(200).json({
				message: "Project partials",
				data: partials,
			});
		} catch (error) {
			Logger.error("Partial index failed", error.message);
			return response.status(400).json({
				status: "error",
				message: "Error indexing partial data",
			});
		}
	}

	async show({ params, response }) {
		try {
			let partials = await Partial.query()
				.where("uuid", params.partialid)
				.with("author")
				.fetch();
			partials = partials.toJSON();
			return response.status(200).json({
				message: "Project partial data",
				data: partials[0],
			});
		} catch (error) {
			Logger.error("Partial show failed", error.message);
			return response.status(400).json({
				status: "error",
				message: "Error getting partial data",
			});
		}
	}

	async create({ request, response, auth }) {
		try {
			const { partialData, projectID } = request.post();
			const name = slugify(partialData.name, {
				lower: true,
			});

			if (["global-header", "global-footer"].includes(name)) {
				return response.status(400).json({
					status: "error",
					message: "Invalid partial name",
				});
			}
			const loggedInUser = auth.current.user;
			const project = await Project.find(projectID);
			const partial = await Partial.create({
				...partialData,
				name,
			});
			await partial.author().associate(loggedInUser);
			await partial.project().associate(project);

			return response.status(201).json({
				message: "Partial created",
				data: partial,
			});
		} catch (error) {
			Logger.error("Partial create failed", error.message);
			return response.status(400).json({
				status: "error",
				message: "Error creating partial data",
			});
		}
	}

	async update({ request, params, response, auth }) {
		try {
			const { partialData } = request.post();
			const partial = await Partial.findBy("uuid", params.partialid);
			const project = await partial.project().fetch();

			partial.json_content = partialData.json_content;
			await partial.save();

			await PageService.republisPagesWithPartial(project, partial.uuid);
			return response.status(200).json({
				message: "Partial updated",
				data: partial,
			});
		} catch (error) {
			Logger.error("Partial update failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error saving partial data",
			});
		}
	}

	async delete({ request, params, response, auth }) {
		try {
			const { pid } = request.post();
			const loggedInUser = auth.current.user;
			const partial = await Partial.findBy("uuid", params.partialid);
			if (["global-header", "global-footer"].includes(partial.name)) {
				return response.status(400).json({
					status: "error",
					message: "Could not delete default partial",
				});
			}
			let project = await loggedInUser
				.projects()
				.where("project_id", pid)
				.fetch();
			if (!project.rows.length) {
				throw new Error("Invalid project");
			}
			await project.rows[0]
				.partials()
				.where("uuid", params.partialid)
				.update({ deleted: true });

			response.status(200).json({
				message: "Partial deleted",
				data: await project.rows[0]
					.partials()
					.where("deleted", false)
					.with("author")
					.fetch(),
			});
		} catch (error) {
			Logger.error("Partial delete failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not delete partial",
			});
		}
	}

	async getHTMLContent({ request, response }) {
		try {
			const { name, projectID } = request.get();
			const project = await Project.find(projectID);
			let partial = await project.partials().where("name", name).fetch();
			partial = partial.toJSON();

			response.status(200).json({
				data: {
					context: partial[0].json_content.reduce(
						(acc, curr) => acc.concat(curr.context),
						[]
					),
					htmlstr: partial[0].json_content.reduce(
						(acc, curr) => acc + curr.htmlstr,
						""
					),
				},
				message: "Success",
			});
		} catch (error) {
			Logger.error("Error getting page HTML", error);
			response.status(400).json({
				status: "error",
				message: "Could not get page HTML",
			});
		}
	}
}

module.exports = PartialController;
