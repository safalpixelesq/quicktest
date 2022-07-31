"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Project extends Model {
	static boot() {
		super.boot();

		this.addHook("beforeSave", ["ProjectHook.setSlug"]);
		this.addHook("afterCreate", ["ProjectHook.createSetting"]);
	}

	static get computed() {
		return ["slugId"];
	}

	getSlugId(project) {
		return `${project.slug}_${project.id}`;
	}

	users() {
		return this.belongsToMany("App/Models/User")
			.pivotTable("user_projects")
			.withTimestamps();
	}

	setting() {
		return this.hasOne("App/Models/Setting");
	}

	themes() {
		return this.hasMany("App/Models/Theme");
	}

	collections() {
		return this.hasMany("App/Models/Collection");
	}

	pages() {
		return this.hasMany("App/Models/Page");
	}

	partials() {
		return this.hasMany("App/Models/Partial");
	}

	templates() {
		return this.hasMany("App/Models/Template");
	}

	activities() {
		return this.hasMany("App/Models/Activity");
	}

	static get hidden() {
		return [];
	}
}

module.exports = Project;
