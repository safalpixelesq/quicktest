"use strict";

const Logger = use("Logger");
const TemplateService = use("Template");

class TemplateController {
	async index({ request, response }) {
		try {
			const templates = await TemplateService.list(request.project);
			return response.status(200).json({
				message: "Project templates",
				data: templates,
			});
		} catch (error) {
			Logger.error("Template index failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error indexing template data",
			});
		}
	}

	async show({ request, params, response }) {
		try {
			const template = await TemplateService.get(
				request.project,
				params.template_id
			);

			return response.status(200).json({
				message: "Project template data",
				data: template,
			});
		} catch (error) {
			Logger.error("Template show failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error getting template data",
			});
		}
	}

	async create({ request, response, auth }) {
		try {
			const { templateData, collectionId } = request.post();
			const loggedInUser = auth.current.user;

			const template = await TemplateService.create(request.project, {
				templateData,
				collectionId,
				loggedInUser,
			});

			return response.status(201).json({
				message: "Template created",
				data: template,
			});
		} catch (error) {
			Logger.error("Template create failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error creating template data",
			});
		}
	}

	async update({ request, params, response, auth }) {
		try {
			const { templateData, updatePages } = request.post();
			await TemplateService.update(request.project, {
				templateData,
				templateId: params.template_id,
				loggedInUser: auth.current.user,
				updatePages,
			});

			const template = await TemplateService.get(
				request.project,
				params.template_id
			);

			return response.status(200).json({
				message: "Template updated",
				data: template,
			});
		} catch (error) {
			Logger.error("Template update failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error saving template data",
			});
		}
	}

	async delete({ request, params, response }) {
		try {
			await TemplateService.delete(request.project, params.template_id);
			const templates = await TemplateService.list(request.project);

			response.status(200).json({
				message: "Template deleted",
				data: templates,
			});
		} catch (error) {
			Logger.error("Template delete failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not delete template",
			});
		}
	}
}

module.exports = TemplateController;
