"use strict";

const _ = require("lodash");
const slugify = require("slugify");
const Logger = use("Logger");
const Env = use("Env");
const User = use("App/Models/User");
const Theme = use("App/Models/Theme");
const Constants = use("App/Utils/Constants");
const PartialHelper = use("App/Utils/PartialHelper");
const PageHelper = use("App/Utils/PageHelper");
const ThemeService = use("Theme");
const Integration = use("App/Models/Integration");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Project = use("App/Models/Project");

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
	/**
	 * Show a list of all projects
	 * GET projects
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 *
	 * @param {View} ctx.view
	 */
	async all({ request, response, auth }) {
		try {
			// const user = await auth.user;
			const projects = await Project.all();
			response.json(projects);
		} catch (error) {
			console.log(error);
			Logger.error(`Projects fetch failed`, error.message);
			return response.status(400).json({
				status: "error",
				message: "Could not fetch projects",
			});
		}
	}

	/**
	 * Show a list of all projects per user
	 * GET projects
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 *
	 * @param {View} ctx.view
	 */
	async index({ request, response, auth }) {
		try {
			const user = await auth.user;
			const projects = await user
				.projects()
				.where("active", true)
				.with("setting.integration")
				.withCount("pages")
				.fetch();

			if (projects.length) {
				return response.status(400).json({
					status: "error",
					message: "Could not fetch projects",
				});
			}

			response.status(200).json({
				message: "User projects",
				data: projects,
			});
		} catch (error) {
			console.log(error);
			Logger.error(`Projects fetch failed`, error.message);
			return response.status(400).json({
				status: "error",
				message: "Could not fetch projects",
			});
		}
	}

	/**
	 * Render a form to be used for creating a new project.
	 * GET projects/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create({ request, response, view }) {}

	/**
	 * Create/save a new project.
	 * POST projects
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response, auth }) {
		try {
			const { name, theme: themeID } = request.post();
			const slug = await slugify(name, { lower: true });
			const user = auth.current.user;
			let projects = await user.projects().where("active", true).fetch();
			projects = projects.toJSON();
			const isDupe = await _.findIndex(projects, (project) => {
				return project.slug === slug;
			});

			if (isDupe !== -1) {
				Logger.error(`Project Creation failed: Duplicate`);
				return response.status(500).json({
					message: "Duplicate entry for project",
					errors: [
						{
							message: "Must be unique name",
						},
					],
				});
			} else {
				const project = await Project.create({ name, slug });
				const projectJSON = project.toJSON();
				await project.users().attach(user.id, (row) => {
					row.role = Constants.roles.OWNER;
				});
				project.users = await project.users().fetch();
				const setting = await project.setting().fetch();

				project.setting = setting;
				let theme = null;

				if (themeID) {
					theme = await Theme.find(parseInt(themeID));
				} else {
					theme = await ThemeService.create(project, {
						themeData: {
							name: "default",
						},
					});
				}
				await ThemeService.makeThemeGlobal(
					theme.name,
					projectJSON.slugId,
					!!theme.system_default
				);
				await setting.theme().associate(theme);

				// create default pages
				await PageHelper.createDefaults(user, project);

				// create default partials
				await PartialHelper.createDefaults(user, project);

				Logger.info(`${user.email} created ${project.name}`);
				return response.status(201).json({
					message: "Project created",
					data: project,
				});
			}
		} catch (error) {
			console.log(error);
			Logger.error(`Project Creation failed`, error.message);
			return response.status(400).json({
				status: "error",
				message: "Could not create project",
			});
		}
	}

	/**
	 * Display a single project.
	 * GET projects/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params, request, response, auth }) {
		try {
			const user = await auth.user;
			const project = await user
				.projects()
				.where("slug", params.slug)
				.where("active", true)
				.with("setting.integration")
				.with("users", (builder) => {
					builder.withPivot("role");
				})
				.with("partials.author")
				.with("partials", (builder) => {
					builder.where("partials.deleted", false);
				})
				.fetch();
			// project.setting = await project.setting().fetch();

			if (!project.toJSON().length) {
				Logger.error("Projects fetch failed");
				return response.status(400).json({
					status: "error",
					message: "Could not fetch projects",
				});
			}
			response.status(201).json({
				message: "User projects",
				data: project,
			});
		} catch (error) {
			console.log(error);
			Logger.error(`Projects fetch failed`, error.message);
			return response.status(400).json({
				status: "error",
				message: "Could not fetch projects",
			});
		}
	}

	/**
	 * Render a form to update an existing project.
	 * GET projects/:id/edit
	 * commit
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit({ params, request, response, view }) {}

	/**
	 * Update project details.
	 * PUT or PATCH projects/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response, auth }) {
		try {
			const user = auth.current.user;
			const {
				name,
				type,
				icon,
				premium,
				plan,
				library,
				setting,
				apimode,
			} = request.post();

			const project = await Project.find(params.id);
			project.name = name || project.name;
			project.slug = await slugify(project.name, { lower: true });

			// if updating name, validate non duplicate
			if (name) {
				let projects = await user
					.projects()
					.where("active", true)
					.fetch();
				projects = projects.toJSON();
				const isDupe = await _.findIndex(projects, (p) => {
					return p.slug === project.slug;
				});

				if (isDupe !== -1) {
					return response.status(400).json({
						message: "Duplicate project",
					});
				}
			}

			project.type = type || project.type;
			project.icon = icon || project.icon;
			project.premium = premium || project.premium;
			project.plan = plan || project.plan;
			project.library = library || project.library;
			project.apimode = apimode || project.apimode;

			await project.save();
			const projectJSON = project.toJSON();
			if (setting) {
				const settings = await project.setting().fetch();
				settings.sitemap = setting.sitemap || settings.sitemap;
				settings.localize = setting.localize || settings.localize;
				settings.domain = setting.domain || settings.domain;

				if (setting.theme) {
					const theme = await Theme.find(setting.theme);
					await settings.theme().associate(theme);
					await ThemeService.makeThemeGlobal(
						theme.name,
						projectJSON.slugId,
						!!theme.system_default
					);
				}

				if (setting.integration) {
					const integration = await settings.integration().fetch();
					if (integration) {
						await settings.integration().update({
							type: setting.integration.type,
							credentials: JSON.stringify(
								setting.integration.credentials
							),
						});
					} else {
						await settings
							.integration()
							.create({ ...setting.integration });
					}
				}

				await settings.save();
			}

			project.setting = await project.setting().fetch();
			Logger.info(`${project.name}: Updated`);
			response.status(201).json({
				message: "Project updated",
				data: project,
			});
		} catch (error) {
			console.log(error);
			Logger.error("Project update failed", error.message);
			response.status(500).json({
				message: "Project update failed",
			});
		}
	}

	/**
	 * Delete a project with id.
	 * DELETE projects/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {
		try {
			const project = await Project.find(params.id);
			project.active = false;
			await project.save();
			Logger.info(`${project.name}: Deleted`);
			response.status(201).json({
				message: "Project deleted",
			});
		} catch (error) {
			console.log(error);
			Logger.error(`Project Deletion failed`, error.message);
			return response.status(400).json({
				status: "error",
				message: "Could not create project",
			});
		}
	}

	/**
	 * Lists all the pages slug
	 * DELETE projects/:id
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async getAvailableSlugs({ request, response }) {
		try {
			const { projectID } = request.get();
			const project = await Project.find(projectID);
			let pages = await project
				.pages()
				.where("deleted", false)
				.with("revisions", (builder) => {
					builder.where("published", true);
				})
				.fetch();

			pages = pages.toJSON();
			const slugs = pages
				.filter((p) => p.revisions.length)
				.map((p) => p.slug);
			response.status(200).json({
				data: slugs,
				message: "Success",
			});
		} catch (error) {
			Logger.error("Error listing available slugs", error);
			response.status(400).json({
				status: "error",
				message: "Could not list available slugs",
			});
		}
	}

	async export({ params, response }) {
		try {
			const { id } = params;
			const project = await Project.find(id);
			return await PageHelper.downloadPages(project);
		} catch (error) {
			Logger.error("Error exporting project", error);
			response.status(400).json({
				status: "error",
				message: "Could not export project",
			});
		}
	}
}

module.exports = ProjectController;
