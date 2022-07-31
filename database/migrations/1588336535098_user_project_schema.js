"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserProjectSchema extends Schema {
	up() {
		this.create("user_projects", (table) => {
			table.increments();
			table
				.integer("user_id")
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
			table.string("role");
			table.timestamps();
		});
	}

	down() {
		this.drop("user_projects");
	}
}

module.exports = UserProjectSchema;
