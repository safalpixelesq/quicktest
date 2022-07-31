"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Partial extends Model {
	static boot() {
		super.boot();
		this.addHook("beforeCreate", [
			"PartialHook.addUUID",
			"PartialHook.addHTMLStr",
		]);
	}

	static get computed() {
		return ["module"];
	}

	author() {
		return this.belongsTo("App/Models/User", "author_id");
	}

	project() {
		return this.belongsTo("App/Models/Project");
	}

	getJsonContent(json_content) {
		return JSON.parse(json_content);
	}

	setJsonContent(json_content) {
		return JSON.stringify(json_content);
	}

	getModule(par) {
		return {
			name: par.name,
			handle: "custom-partial-module",
			uid: `partial-${par.id}`,
			group: "partial",
			isPartial: true,
			partialID: par.uuid,
			context: par.json_content
				? par.json_content.map((content) => content.context)
				: [],
			htmlstr: par.json_content
				? par.json_content.reduce((acc, curr) => {
						return acc + curr.htmlstr;
				  }, "")
				: "",
		};
	}
}

module.exports = Partial;
