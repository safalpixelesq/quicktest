"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PageSchema extends Schema {
	up() {
		this.create("pages", (table) => {
			table.increments();
			table.string("slug").notNullable();
			table.uuid("uuid").unique().notNullable();
			table.boolean("deleted").defaultTo(false);
			table
				.integer("author_id")
				.unsigned()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
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
			table.timestamps();
		});
	}

	down() {
		this.drop("pages");
	}
}

module.exports = PageSchema;
