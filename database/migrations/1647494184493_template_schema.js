"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TemplateSchema extends Schema {
	up() {
		this.create("templates", (table) => {
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
				.integer("collection_id")
				.unsigned()
				.references("id")
				.inTable("collections")
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
		console.log("was here \n\n");
		this.drop("templates");
	}
}

module.exports = TemplateSchema;
