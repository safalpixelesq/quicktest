"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Theme extends Model {
	project() {
		return this.belongsTo("App/Models/Project");
	}

	getVariables(variables) {
		return JSON.parse(variables);
	}

	setVariables(variables) {
		return JSON.stringify(variables);
	}
}

module.exports = Theme;
