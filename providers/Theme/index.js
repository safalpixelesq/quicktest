"use strict";

const Env = use("Env");
const View = use("View");
const Drive = use("Drive");
const Helpers = use("Helpers");
const Logger = use("Logger");
const ThemeModel = use("App/Models/Theme");
const slugify = require("slugify");
const sass = require("sass");
const SystemThemes = require("./system");
class Theme {
	constructor() {
		this.defaultVariables = {
			// breakpoints
			breakpoint_small: "640px",
			breakpoint_medium: "960px",
			breakpoint_large: "1200px",
			breakpoint_xlarge: "1600px",
			// backgrounds
			global_background: "#fff",
			global_muted_background: "#f8f8f8",
			global_primary_background: "#1e87f0",
			global_secondary_background: "#222",
			global_success_background: "#32d296",
			global_warning_background: "#faa05a",
			global_danger_background: "#f0506e",
			// colors
			global_color: "#666",
			global_emphasis_color: "#333",
			global_muted_color: "#999",
			global_link_color: "#1e87f0",
			global_link_hover_color: "#0f6ecd",
			global_inverse_color: "#fff",
			// fonts
			global_font_size: "16px",
			global_line_height: "1.5",
			global_2xlarge_font_size: "2.625rem",
			global_xlarge_font_size: "2rem",
			global_large_font_size: "1.5rem",
			global_medium_font_size: "1.25rem",
			global_small_font_size: "0.875rem",
		};
	}
	/**
	 * Get a theme in a project
	 */
	async get(project, themeId) {
		const theme = await project
			.themes()
			.where("id", themeId)
			.where("deleted", false)
			.fetch();

		return theme.rows[0];
	}

	/**
	 * Get a list of themes in a project
	 */
	async list(project) {
		let customThemes = await project
			.themes()
			.where("deleted", false)
			.orderBy("updated_at", "desc")
			.fetch();
		customThemes = customThemes.toJSON();

		let systemThemes = await this.getSystemTheme();
		systemThemes = systemThemes.toJSON();

		return [...systemThemes, ...customThemes];
	}

	/**
	 * Create a theme in a project
	 */
	async create(project, payload) {
		const projectJSON = project.toJSON();
		const { themeData } = payload;
		const slugifiedName = slugify(themeData.name, {
			lower: true,
		});

		const existingTheme = await project
			.themes()
			.where("deleted", false)
			.where("name", slugifiedName)
			.fetch();

		if (existingTheme.rows[0]) {
			throw new Error("Duplicate theme found");
		}

		const theme = await project.themes().create({
			name: slugifiedName,
			variables: this.defaultVariables,
		});

		const css = this.generateThemeCSS({
			...this.defaultVariables,
			projectClass: `${projectJSON.slugId}`,
		});
		await this.uploadThemeCSS(
			`${projectJSON.slugId}/${theme.name}.css`,
			Buffer.from(css)
		);

		return theme;
	}

	/**
	 * Update a theme in a project
	 */
	async update(project, payload) {
		const projectJSON = project.toJSON();
		const { variables } = payload.themeData;
		const themeId = parseInt(payload.themeId);
		await project
			.themes()
			.where("id", themeId)
			.where("deleted", false)
			.whereNot("system_default", true)
			.update({ variables: JSON.stringify(variables) });

		const theme = await this.get(project, themeId);
		const css = this.generateThemeCSS({
			...variables,
			projectClass: projectJSON.slugId,
		});
		await this.uploadThemeCSS(
			`${projectJSON.slugId}/${theme.name}.css`,
			Buffer.from(css)
		);
		// if updated theme is global, update app.css
		const setting = await project.setting().fetch();
		if (setting.theme_id === themeId) {
			await this.makeThemeGlobal(
				theme.name,
				projectJSON.slugId,
				!!theme.system_default
			);
		}

		return theme;
	}

	/**
	 * Delete a theme from project
	 */
	async delete(project, themeId) {
		const result = await project
			.themes()
			.where("id", themeId)
			.whereNot("system_default", true)
			.update({ deleted: true });

		return result;
	}

	/**
	 * Get a list of system themes
	 */
	async getSystemTheme() {
		const systemThemes = await ThemeModel.query()
			.where("system_default", true)
			.where("deleted", false)
			.fetch();
		return systemThemes;
	}
	/**
	 * Generates a CSS for the theme variables
	 */
	generateThemeCSS(variables) {
		// generate new theme
		const uikitTheme = View.render("uikit-scss", variables);
		const result = sass.compileString(uikitTheme, {
			loadPaths: [`${Helpers.appRoot()}/node_modules`],
		});
		return result.css;
	}

	/**
	 * Uploads the CSS string to spaces
	 */

	async uploadThemeCSS(filePath, bufferString) {
		const envFilePath = `${Env.get("NODE_ENV")}/${filePath}`;
		Logger.info(`Uploading theme : ${envFilePath}`);
		// upload to spaces
		await Drive.disk("theme").put(envFilePath, bufferString, {
			ACL: "public-read",
			ContentType: "text/css",
		});
	}

	/**
	 * Copies the theme CSS to app CSS
	 */
	async makeThemeGlobal(themeName, projectFolder, isSystemTheme) {
		Logger.info("Updating global theme", arguments);
		const source = await Drive.disk("theme").get(
			`${Env.get("NODE_ENV")}/${
				isSystemTheme ? "system" : projectFolder
			}/${themeName}.css`
		);
		await Drive.disk("theme").put(
			`${Env.get("NODE_ENV")}/${projectFolder}/app.css`,
			source,
			{
				ACL: "public-read",
				ContentType: "text/css",
			}
		);
	}

	async prepareSystemTheme() {
		for (const theme in SystemThemes) {
			const css = this.generateThemeCSS({
				...SystemThemes[theme],
			});
			await this.uploadThemeCSS(`system/${theme}.css`, Buffer.from(css));
		}
	}
}

module.exports = Theme;
