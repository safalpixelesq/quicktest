"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Revision extends Model {
	static boot() {
		super.boot();
		this.addHook("beforeCreate", ["RevisionHook.addHTMLStr"]);
		this.addHook("beforeUpdate", ["RevisionHook.addHTMLStr"]);
		this.addHook("afterCreate", [
			"RevisionHook.deleteOldRevision",
			"RevisionHook.updateRevisionHistory",
		]);
	}

	author() {
		return this.belongsTo("App/Models/User", "author_id");
	}

	page() {
		return this.belongsTo("App/Models/Page");
	}

	getJsonContent(json_content) {
		return JSON.parse(json_content);
	}

	setJsonContent(json_content) {
		return JSON.stringify(json_content);
	}
}

module.exports = Revision;
