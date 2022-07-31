"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ThemeSchema extends Schema {
	up() {
		this.create("themes", (table) => {
			table.increments();
			table.string("name").notNullable();
			table
				.integer("project_id")
				.unsigned()
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");
			table.boolean("deleted").defaultTo(false);
			table.boolean("system_default").defaultTo(false);
			table.text("variables", "longtext");
			table.timestamps();
		});
	}

	down() {
		this.drop("themes");
	}
}

module.exports = ThemeSchema;
