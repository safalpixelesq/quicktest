"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Setting extends Model {
	profile() {
		return this.belongsTo("App/Models/Project");
	}

	theme() {
		return this.belongsTo("App/Models/Theme");
	}

	integration() {
		return this.hasOne("App/Models/Integration");
	}
}

module.exports = Setting;
