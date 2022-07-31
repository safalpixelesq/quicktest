"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ActivitySchema extends Schema {
	up() {
		this.create("activities", (table) => {
			table.increments();
			table
				.integer("project_id")
				.unsigned()
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");
			table
				.integer("user_id")
				.unsigned()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table
				.integer("page_id")
				.unsigned()
				.references("id")
				.inTable("pages")
				.onDelete("CASCADE");
			table.string("action").notNullable();
			table.timestamps();
		});
	}

	down() {
		this.drop("activities");
	}
}

module.exports = ActivitySchema;
