"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Entry extends Model {
	static boot() {
		super.boot();
		this.addHook("beforeCreate", ["EntryHook.addUUID"]);
	}

	author() {
		return this.belongsTo("App/Models/User", "author_id");
	}

	page() {
		return this.belongsTo("App/Models/Page");
	}

	collection() {
		return this.belongsTo("App/Models/Collection");
	}

	getJsonContent(json_content) {
		return JSON.parse(json_content);
	}

	setJsonContent(json_content) {
		return JSON.stringify(json_content);
	}
}

module.exports = Entry;
