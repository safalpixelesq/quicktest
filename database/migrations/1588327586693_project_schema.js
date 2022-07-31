"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProjectSchema extends Schema {
	up() {
		this.create("projects", (table) => {
			table.increments();
			table.string("name");
			table.string("slug").notNullable();
			table.string("type").nullable();
			table.string("icon").nullable();
			table.boolean("premium").defaultTo(false);
			table.boolean("active").defaultTo(true);
			table.string("plan").defaultTo("free");
			table.string("library").defaultTo("tailwind");
			table.string("apimode").defaultTo("page");
			table.string("favicon").nullable();
			table.boolean("purge_css").defaultTo(false);
			table.timestamps();
		});
	}

	down() {
		this.drop("projects");
	}
}

module.exports = ProjectSchema;
