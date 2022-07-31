"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SettingSchema extends Schema {
	up() {
		this.create("settings", (table) => {
			table.increments();
			table
				.integer("project_id")
				.unsigned()
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");
			table
				.integer("theme_id")
				.unsigned()
				.references("id")
				.inTable("themes")
				.onDelete("SET NULL");
			table.boolean("sitemap").defaultTo(false);
			table.boolean("localize").defaultTo(false);
			table.boolean("domain").defaultTo(false);
			table.string("ga_id").nullable();
			table.timestamps();
		});
	}

	down() {
		this.drop("settings");
	}
}

module.exports = SettingSchema;
