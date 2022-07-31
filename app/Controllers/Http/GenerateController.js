"use strict";

const Promise = require("bluebird");
const path = require("path");
const _ = require("lodash");
const fs = Promise.promisifyAll(require("fs-extra"));
const Logger = use("Logger");
const Env = use("Env");
const { PurgeCSS } = require("purgecss");

const defaultLib = "uikit";
const purge = false;

class GenerateController {
	// Get modules for public meta
	async getModulesMeta({ params, response }) {
		const fractal = await this._getFractalConfig(params.library);
		const collection = await this._loadFragments(fractal);
		let modules = [];
		let allModules = collection.toJSON().items;
		for (let i = 0; i < allModules.length; i++) {
			const module = allModules[i];
			if (module.viewPath.includes("sections")) {
				for (let j = 0; j < module.variants.items.length; j++) {
					const element = module.variants.items[j];
					if (
						element.status &&
						element.status.label === "Ready" &&
						!element.isHidden
					) {
						modules.push({
							uid: element.id,
							name: element.name,
							label: element.label,
							handle: element.handle,
							module: element.handle,
							baseHandle: element.baseHandle,
							title: element.title,
							group: element.meta ? element.meta.group : "misc",
							tags: element.meta ? element.meta.tags : "misc",
							config: element.meta ? element.meta.config : "misc",
							placement: element.meta
								? element.meta.placement
								: "misc",
							meta: element.meta,
							notes: element.notes,
							status: element.status,
							isHidden: element.isHidden,
						});
					}
				}
			}
		}
		return response.json(modules);
	}

	// Get groups
	async getGroups({ params, response }) {
		try {
			console.time("publicGroups");
			const jsonpath = `./modules/${defaultLib}/allmodspub.json`;
			if (fs.existsSync(jsonpath)) {
				const groups = await fs
					.readFile(jsonpath)
					.then((data) => JSON.parse(data));
				console.log("Using Cache");
				console.timeEnd("publicGroups");
				return response.json(groups);
			} else {
				const fractal = await this._getFractalConfig("uikit");
				const collection = await this._loadFragments(fractal);
				let modules = [];
				let allModules = collection.toJSON().items;
				for (let i = 0; i < allModules.length; i++) {
					const module = allModules[i];
					if (module.viewPath.includes("sections")) {
						for (let j = 0; j < module.variants.items.length; j++) {
							const element = module.variants.items[j];
							// console.log(element.context, 'ele')
							if (
								element.status &&
								element.status.label === "Ready" &&
								element.meta &&
								!element.isHidden
							) {
								if (element.context) {
									element.context.module = element.handle;
								}
								modules.push({
									uid: element.id,
									name: element.name,
									label: element.label,
									handle: element.handle,
									baseHandle: element.baseHandle,
									title: element.title,
									group: element.meta
										? element.meta.group
										: "misc",
									tags: element.meta
										? element.meta.tags
										: "misc",
									config: element.meta
										? element.meta.config
										: "misc",
									placement: element.meta
										? element.meta.placement
										: "misc",
									meta: element.meta,
									context: element.context,
									notes: element.notes,
									status: element.status,
									isHidden: element.isHidden,
								});
							}
						}
					}
				}

				const groups = _.groupBy(modules, (mod) => mod.group);
				await fs.writeFile(jsonpath, JSON.stringify(groups));
				console.log("Using API");
				console.timeEnd("publicGroups");
				return response.json(groups);
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Get groups Auth
	async getGroupsAuth({ params, response }) {
		try {
			console.time("allmodshtml");
			const jsonpath = `./modules/${defaultLib}/allmods.json`;

			if (fs.existsSync(jsonpath)) {
				const groups = await fs
					.readFile(jsonpath)
					.then((data) => JSON.parse(data));
				console.log("Using Cache");
				console.timeEnd("allmodshtml");
				return response.json(groups);
			} else {
				const fractal = await this._getFractalConfig("uikit");
				const collection = await this._loadFragments(fractal);
				let modules = [];
				let allModules = collection.toJSON().items;
				for (let i = 0; i < allModules.length; i++) {
					const module = allModules[i];
					if (module.viewPath.includes("sections")) {
						for (let j = 0; j < module.variants.items.length; j++) {
							const element = module.variants.items[j];
							// console.log(element.context, 'ele')
							if (
								element.status &&
								element.status.label === "Ready" &&
								element.meta &&
								!element.isHidden
							) {
								if (element.context) {
									element.context.module = element.handle;
								}

								const htmlstr = await this._renderFragment(
									fractal,
									element.handle,
									element.context
								);
								modules.push({
									uid: element.id,
									name: element.name,
									label: element.label,
									handle: element.handle,
									baseHandle: element.baseHandle,
									title: element.title,
									group: element.meta
										? element.meta.group
										: "misc",
									tags: element.meta
										? element.meta.tags
										: "misc",
									config: element.meta
										? element.meta.config
										: "misc",
									placement: element.meta
										? element.meta.placement
										: "misc",
									meta: element.meta,
									context: element.context,
									notes: element.notes,
									status: element.status,
									isHidden: element.isHidden,
									htmlstr: htmlstr,
								});
							}
						}
					}
				}

				const groups = _.groupBy(modules, (mod) => mod.group);
				await fs.writeFile(jsonpath, JSON.stringify(groups));
				console.log("Using API");
				console.timeEnd("allmodshtml");
				return response.json(groups);
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Get modules based on group
	async getModulesbyGroup({ params, response }) {
		const fractal = await this._getFractalConfig("uikit");
		const collection = await this._loadFragments(fractal);
		let modules = [];
		let allModules = collection.toJSON().items;
		for (let i = 0; i < allModules.length; i++) {
			const module = allModules[i];
			if (module.viewPath.includes("sections")) {
				for (let j = 0; j < module.variants.items.length; j++) {
					const element = module.variants.items[j];
					if (
						element.status &&
						element.status.label === "Ready" &&
						element.meta &&
						!element.isHidden &&
						element.meta.group === params.group
					) {
						modules.push({
							uid: element.id,
							name: element.name,
							label: element.label,
							handle: element.handle,
							baseHandle: element.baseHandle,
							title: element.title,
							group: element.meta ? element.meta.group : "misc",
							tags: element.meta ? element.meta.tags : "misc",
							config: element.meta ? element.meta.config : "misc",
							placement: element.meta
								? element.meta.placement
								: "misc",
							meta: element.meta,
							notes: element.notes,
							status: element.status,
							isHidden: element.isHidden,
						});
					}
				}
			}
		}
		return response.json(modules);
	}

	// Get module handles
	async getModulesList({ params, response }) {
		const fractal = await this._getFractalConfig(params.library);
		const collection = await this._loadFragments(fractal);
		let modules = [];
		let allModules = collection.toJSON().items;
		for (let i = 0; i < allModules.length; i++) {
			const module = allModules[i];
			if (module.viewPath.includes("sections")) {
				for (let j = 0; j < module.variants.items.length; j++) {
					const element = module.variants.items[j];
					if (element.status && element.status.label === "Ready") {
						modules.push(element.handle);
					}
				}
			}
		}
		return response.json(modules);
	}

	// Get modules based on library
	async getModulesPublic({ params, response }) {
		const fractal = await this._getFractalConfig(params.library);
		const collection = await this._loadFragments(fractal);
		let modules = [];
		let allModules = collection.toJSON().items;
		for (let i = 0; i < allModules.length; i++) {
			const module = allModules[i];
			if (module.viewPath.includes("sections")) {
				for (let j = 0; j < module.variants.items.length; j++) {
					const element = module.variants.items[j];
					modules.push({
						uid: element.id,
						name: element.name,
						label: element.label,
						handle: element.handle,
						baseHandle: element.baseHandle,
						title: element.title,
						meta: element.meta,
						notes: element.notes,
						status: element.status,
						isHidden: element.isHidden,
					});
				}
			}
		}
		return response.json(modules);
	}

	// Get Modules
	async getModules({ params, request, response, auth }) {
		try {
			const user = await auth.user;
			// const projects = await user
			// 	.projects()
			// 	.with("setting")
			// 	.fetch();
			// const projs = await projects.toJSON();
			// const library = projs[0].library || 'uikit';
			const library = defaultLib;

			const fractal = await this._getFractalConfig(library);
			const collection = await this._loadFragments(fractal);
			let modules = [];
			let allModules = collection.toJSON().items;
			for (let i = 0; i < allModules.length; i++) {
				const module = allModules[i];
				if (module.viewPath.includes("sections")) {
					for (let j = 0; j < module.variants.items.length; j++) {
						const element = _.cloneDeep(module.variants.items[j]);
						delete element.viewPath;
						delete element.content;
						delete element.preview;
						element.htmlstr = "";

						// if (element.context && element.context.image) {
						// 	element.context.image = []
						// 	element.context.image[0] = module.variants.items[j].context.image
						// }
						modules.push(element);
					}
				}
			}
			return response.json(modules);
		} catch (error) {
			console.log(error);
		}
	}

	async getModule({ params, request, response, auth }) {
		try {
			const user = await auth.user;
			// const projects = await user
			// 	.projects()
			// 	.with("setting")
			// 	.fetch();
			// const projs = await projects.toJSON();
			// const library = projs[0].library || 'uikit';
			const library = defaultLib;

			const fractal = await this._getFractalConfig(library);
			const collection = await this._loadFragments(fractal);
			let modules = [];
			let allModules = collection.toJSON().items;
			console.time("timeforOne");
			for (let i = 0; i < allModules.length; i++) {
				const module = allModules[i];
				if (module.viewPath.includes("sections")) {
					for (let j = 0; j < module.variants.items.length; j++) {
						const element = module.variants.items[j];
						delete element.viewPath;
						delete element.content;
						delete element.preview;
						// if (element.context && element.context.image) {
						// 	element.context.image = []
						// 	element.context.image[0] = module.variants.items[j].context.image
						// }
						modules.push(element);
					}
				}
			}

			const currModule = _.find(modules, { handle: params.handle });
			if (currModule == null) {
				Logger.error(`Modules API: ${params.handle} not found`);
				return response
					.status(404)
					.json({ message: "Cannot find module with that handle" });
			}

			const modContext = _.cloneDeep(currModule.context);
			// if (modContext.image) {
			// 	modContext.image = modContext.image[0]
			// }
			const htmlstr = await this._renderFragment(
				fractal,
				params.handle,
				modContext
			);
			// delete currModule.viewPath;
			// delete currModule.content;
			// delete currModule.preview;
			currModule.htmlstr = htmlstr;
			console.timeEnd("timeforOne");
			return response.json(currModule);
		} catch (error) {
			console.log(error);
		}
	}

	async getHTML({ params, request, response, auth }) {
		try {
			const { meta, content } = request.post();
			const user = await auth.user;
			// const project = await this._getProjectbySlug(auth, params);
			const project = {
				name: "pixelesq",
				library: defaultLib,
				setting: {
					theme: meta.theme ? meta.theme : "pq",
					apimode: meta ? meta.apimode : "component",
				},
			};
			const fractal = await this._getFractalConfig(defaultLib);

			// Handle apimode states (page/component/template)
			// Assets based on project params
			const assetPath = meta.assetUrl
				? meta.assetUrl
				: `https://assets.uiaas.io/${project.library}/${project.setting.theme}`;

			console.time("renderFractal");

			const htmlString = await this._getRender(fractal, content);
			console.timeEnd("renderFractal");

			let inlineCSS;
			// try purging
			if (meta.purge || purge) {
				console.log("halwa aya");
				const cssString = await fs.readFile(
					`./modules/${defaultLib}/${
						meta.theme ? meta.theme : "pq"
					}/app.css`
				);

				inlineCSS = await new PurgeCSS().purge({
					content: [{ raw: htmlString, extention: "html" }],
					css: [
						{
							raw: cssString,
						},
					],
					safelist: [
						"pqc",
						"html",
						"svg",
						/^uk-width-/,
						/uk-width/,
						/uk-child-width/,
						/uk-visible/,
						/uk-hidden/,
						/uk-sticky/,
						/uk-margin/,
					],
					safelistPatterns: [/uk-width/],
				});
			}

			// const preview = await this._makePreview(htmlString, assetPath, inlineCSS[0].css);
			const preview = await this._makePreview(
				htmlString,
				assetPath,
				purge || meta.purge ? inlineCSS[0].css : false
			);
			const html = await this._wrapHtml(
				htmlString,
				assetPath,
				project,
				meta,
				purge || meta.purge ? inlineCSS[0].css : false
			);
			Logger.info(
				`GET HTML API: Generated ${project.setting.apimode.toUpperCase()} by ${
					user.email
				}`
			);

			return response.status(200).json({ preview, html });
			// return preview;
		} catch (error) {
			console.log(error);
			Logger.error(`GET HTML API: Failed`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(404).json({ message: error.message });
		}
	}

	async _makePreview(htmlstr, assetPath, inlineCSS) {
		try {
			const preview = `<!DOCTYPE html><html class="pwc"><head><meta charset="utf-8"><title>Preview</title>${
				inlineCSS
					? `<style>${inlineCSS}</style>`
					: `<link rel="stylesheet" href="${assetPath}/app.css" />`
			}</head><body>${htmlstr}<script type="text/javascript" src="${assetPath}/app.js"></script></body></html>`;
			return preview;
		} catch (error) {
			console.log(error);
			Logger.error(`GET HTML API: Preview Failed`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(500).json({
				message: error.message,
				internal: "GET HTML API: Preview Failed",
			});
		}
	}

	async _wrapHtml(htmlstr, assetPath, project, meta, inlineCSS) {
		try {
			let html = "";
			switch (project.setting.apimode) {
				case "page":
					html = this.makePage(
						assetPath,
						htmlstr,
						project,
						meta,
						inlineCSS
					);
					break;
				case "component":
					html = inlineCSS
						? `<div><style>${inlineCSS}</style>${htmlstr}</div>`
						: htmlstr;
					break;
				default:
					break;
			}
			return html;
		} catch (error) {
			console.log(error);
			Logger.error(`GET HTML API: Wraphtml Failed`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(500).json({
				message: error.message,
				internal: "GET HTML API: Wraphtml Failed",
			});
		}
	}
	makePage(assetPath, htmlstr, project, meta, inlineCSS) {
		try {
			const {
				title = project.name,
				description,
				image,
				jsonld,
			} = { ...meta };
			const { ga_id } = project.setting;
			let html = `<!DOCTYPE html>
			<html lang="en-us" class="pqc">
			<head>
				<meta charset="utf-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
				<meta name="viewport" content="width=device-width,initial-scale=1">
				<title>${title}</title>
				<meta name="description" content="${description}">
				<meta property="og:title" content=">${title}">
				<meta property="og:description" content="${description}">
				<meta property="og:url" content="">
				<meta property="og:image" content="${image ? image : "imageurl"}">
				<meta property="og:type" content="website" />
				<link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon">
				<!-- Place favicon.ico in the root directory -->
				
				<link rel="preconnect" href="https://assets.uiaas.io" crossorigin>
				<link rel="preconnect" href="https://www.google-analytics.com" crossorigin="anonymous">
				${
					inlineCSS
						? `<style>${inlineCSS}</style>`
						: `<link rel="stylesheet" href="${assetPath}/app.css">`
				}
				${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : null}
			</head>
			<body class="pqc">
				${htmlstr}
				<script type="text/javascript" src="${assetPath}/app.js"></script>
				${
					ga_id
						? `<!-- Google Analytics -->
				<script>
				window.ga = function () { ga.q.push(arguments) }; ga.q = []; ga.l = +new Date;
				ga('create', ${ga_id}, 'auto'); ga('set', 'anonymizeIp', true); ga('set', 'transport', 'beacon'); ga('send', 'pageview')
				</script>
				<script src="https://www.google-analytics.com/analytics.js" async></script>`
						: ""
				}
			</body>
			</html>`;
			// const htmln1 = html.replace(/(\r\n|\t|\n|\r|\|)/gm, "")
			// const htmln2 = htmln1.replace(/\/g, '')
			return html;
		} catch (error) {
			console.log(error);
			Logger.error(`GET HTML API: makePage Failed`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(500).json({
				message: error.message,
				internal: "GET HTML API: makePage Failed",
			});
		}
	}

	_getFractalConfig(library) {
		try {
			// Fractal specific config
			const fractal = require("@frctl/fractal").create();
			fractal.components.set("ext", ".html");
			// fractal.web.set('static.path', path.join(__dirname, 'public'));
			fractal.web.set("builder.dest", "./uploads");
			const path = require("path");
			const { nunjucks } = require(path.resolve(
				`./modules/${library}`,
				`nunjucks`
			));
			fractal.components.engine(nunjucks);
			fractal.components.set("path", `./modules/${library}`);
			return fractal;
		} catch (error) {
			console.log(error);
			Logger.error(`Failed loading fractal`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(500).json({
				message: error.message,
				internal: "Failed loading fractal",
			});
		}
	}

	async _getProjectbySlug(auth, params) {
		try {
			const user = await auth.user;
			const project = await user
				.projects()
				.where("slug", params.slug)
				.with("setting")
				.fetch();
			// project.setting = await project.setting().fetch();
			const proj = await project.toJSON();
			return proj[0];
		} catch (error) {
			console.log(error);
			Logger.error(`_getProjectbySlug`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(500).json({
				message: error.message,
				internal: "_getProjectbySlug",
			});
		}
	}

	/**
	 *
	 * @param fragments Array of requested fragments
	 * */
	async _getRender(fractal, fragments) {
		try {
			return fractal.load().then(async () => {
				let htmlString = "";
				for (let i = 0; i < fragments.length; i++) {
					const fragment = fragments[i];
					const handle = fragment.module;
					let context = fragment;
					context.uid = context.uid ? context.uid : `section${i + 1}`;
					let finalhtml = await this._renderFragment(
						fractal,
						handle,
						context
					);

					htmlString = htmlString + finalhtml;
				}
				return htmlString;
			});
		} catch (error) {
			console.log(error);
			Logger.error(`Failed GET Render`, error);
			Logger.debug(`GET HTML API: Failed `, error);
			return response.status(500).json({
				message: error.message,
				internal: "Failed GET Render",
			});
		}
	}

	/**
	 * Get the render string from nunjucks(using fractal-wrapper)
	 * template render() function
	 *
	 * @param handle  Unique identifier for each fragment
	 * @param context Data to render the fragment with
	 * */
	async _renderFragment(fractal, handle, context) {
		try {
			return (
				fractal.components
					.render(`@${handle}`, context)
					.then((html) => {
						return html;
					})
					// .catch(err => response.notAcceptable());
					.catch((err) =>
						Logger.info(`Error at generate ==> '${err.message}'`)
					)
			);
		} catch (error) {
			console.log(error);
			Logger.error(`Failed _renderFragment`, error);
			Logger.debug(`_renderFragment `, error);
			return response.status(500).json({
				message: error.message,
				internal: "_renderFragment",
			});
		}
	}

	async _loadFragments(fractal) {
		try {
			return fractal.components.load().then(() => {
				let coll = fractal.components.flatten();
				return coll;
			});
		} catch (error) {
			console.log(error);
			Logger.error(`Modules API: Module not found`, error);
			return response
				.status(404)
				.json({ message: "Cannot find that module" });
		}
	}
}

module.exports = GenerateController;
