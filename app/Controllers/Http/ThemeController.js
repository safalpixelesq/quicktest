"use strict";

const Logger = use("Logger");
const ThemeService = use("Theme");

class ThemeController {
	async systemIndex({ request, response }) {
		try {
			const themes = await ThemeService.getSystemTheme();
			return response.status(200).json({
				message: "System themes",
				data: themes,
			});
		} catch (error) {
			Logger.error("System theme index failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error indexing system theme data",
			});
		}
	}

	async index({ request, response }) {
		try {
			const themes = await ThemeService.list(request.project);
			return response.status(200).json({
				message: "Project themes",
				data: themes,
			});
		} catch (error) {
			Logger.error("Theme index failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error indexing theme data",
			});
		}
	}

	async show({ request, params, response }) {
		try {
			const theme = await ThemeService.get(
				request.project,
				params.theme_id
			);
			response.status(200).json({
				message: "Project theme data",
				data: theme,
			});
		} catch (error) {
			Logger.error("Theme show failed", error);
			response.status(400).json({
				status: "error",
				message: "Error getting theme data",
			});
		}
	}

	async create({ request, response, auth }) {
		try {
			const { themeData } = request.post();

			const theme = await ThemeService.create(request.project, {
				themeData,
			});

			response.status(201).json({
				message: "Theme created",
				data: theme,
			});
		} catch (error) {
			console.log(error);
			Logger.error("Theme create failed", error);
			response.status(400).json({
				status: "error",
				message: "Error creating theme",
			});
		}
	}

	async update({ request, params, response }) {
		try {
			const { themeData } = request.post();
			const theme = await ThemeService.update(request.project, {
				themeId: params.theme_id,
				themeData,
			});

			response.status(200).json({
				message: "Theme updated",
				data: theme,
			});
		} catch (error) {
			Logger.error("Theme update failed", error);
			response.status(400).json({
				status: "error",
				message: "Error saving theme data",
			});
		}
	}

	async delete({ request, params, response }) {
		try {
			await ThemeService.delete(request.project, params.theme_id);
			const themes = await ThemeService.list(request.project);
			response.status(200).json({
				message: "Theme deleted",
				data: themes,
			});
		} catch (error) {
			Logger.error("Theme delete failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not delete theme",
			});
		}
	}
}

module.exports = ThemeController;
