"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Page extends Model {
	static boot() {
		super.boot();
		this.addHook("beforeCreate", ["PageHook.addUUID"]);
		this.addHook("afterPaginate", ["PageHook.addDefaultRevisions"]);
	}

	static get computed() {
		return ["filePath"];
	}

	getFilePath(page) {
		const { slug } = page;
		if (slug === "/") {
			return "index.html";
		} else if (slug.startsWith("/") && !slug.endsWith("/")) {
			return `${slug}.html`;
		} else {
			return "";
			// throw new Error(`Invalid slug: ${slug}`);
		}
	}

	author() {
		return this.belongsTo("App/Models/User", "author_id");
	}

	project() {
		return this.belongsTo("App/Models/Project");
	}

	revisions() {
		return this.hasMany("App/Models/Revision");
	}

	meta() {
		return this.hasOne("App/Models/Meta");
	}

	theme() {
		return this.belongsTo("App/Models/Theme");
	}

	entry() {
		return this.hasOne("App/Models/Entry");
	}
}

module.exports = Page;
