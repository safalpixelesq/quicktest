"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Collection extends Model {
	project() {
		return this.belongsTo("App/Models/Project");
	}

	entries() {
		return this.hasMany("App/Models/Entry");
	}

	template() {
		return this.hasOne("App/Models/Template");
	}

	getFieldSchema(schema) {
		return JSON.parse(schema);
	}

	setFieldSchema(schema) {
		return JSON.stringify(schema);
	}
}

module.exports = Collection;
