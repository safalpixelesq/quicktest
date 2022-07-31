"use strict";

const path = require("path");
const fractal = require("@frctl/fractal");
// const Promise = require("bluebird");
// const _ = require("lodash");
// const fs = Promise.promisifyAll(require("fs-extra"));
// const Logger = use("Logger");
// const Env = use("Env");
// const { PurgeCSS } = require("purgecss");

// const defaultLib = "uikit";
// const purge = false;

class Fractal {
	getFractalInstance(library) {
		const fractalInstance = fractal.create();
		fractalInstance.components.set("ext", ".html");
		fractalInstance.web.set("builder.dest", "./uploads");

		const { nunjucks } = require(path.resolve(
			__dirname,
			`../../modules/${library}`,
			"nunjucks"
		));

		fractalInstance.components.engine(nunjucks);
		fractalInstance.components.set("path", `./modules/${library}`);
		return fractalInstance;
	}

	async loadFragments(fractal) {
		try {
			await fractal.components.load();
			return fractal.components.flatten();
		} catch (error) {
			Logger.error(`Modules API: Module not found`, error);
		}
	}

	async getRender(fractal, fragments) {
		try {
			await fractal.load();
			let htmlString = "";
			for (let context of fragments) {
				const handle = context.module;
				const finalhtml = await this.renderFragment(
					fractal,
					handle,
					context
				);
				htmlString += finalhtml;
			}
			return htmlString;
		} catch (error) {
			console.log(error);
			return "";
		}
	}

	async renderFragment(fractal, handle, context) {
		try {
			const html = await fractal.components.render(`@${handle}`, context);
			return html;
		} catch (error) {
			console.log(error);
			return "";
		}
	}
}

module.exports = Fractal;
