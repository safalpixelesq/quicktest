"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CollectionSchema extends Schema {
	up() {
		this.create("collections", (table) => {
			table.increments();
			table.string("name").notNullable();
			table.string("slug").notNullable();
			table
				.integer("project_id")
				.unsigned()
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");
			table.boolean("deleted").defaultTo(false);
			table.boolean("has_pages").defaultTo(false);
			table.text("field_schema", "longtext");
			table.timestamps();
		});
	}

	down() {
		this.drop("collections");
	}
}

module.exports = CollectionSchema;
