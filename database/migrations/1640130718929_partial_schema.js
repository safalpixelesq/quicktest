"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PartialSchema extends Schema {
	up() {
		this.create("partials", (table) => {
			table.increments();
			table.uuid("uuid").unique().notNullable();
			table.string("name").notNullable();
			table.text("json_content", "longtext");
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
			table.timestamps();
		});
	}

	down() {
		this.drop("partials");
	}
}

module.exports = PartialSchema;
