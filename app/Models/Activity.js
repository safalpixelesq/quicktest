"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Activity extends Model {
	user() {
		return this.belongsTo("App/Models/User");
	}

	project() {
		return this.belongsTo("App/Models/Project");
	}

	page() {
		return this.belongsTo("App/Models/Page");
	}
}

module.exports = Activity;
