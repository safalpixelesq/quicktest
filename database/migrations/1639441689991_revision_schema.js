"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RevisionSchema extends Schema {
	up() {
		this.create("revisions", (table) => {
			table.increments();
			table
				.integer("author_id")
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
			table.text("json_content", "longtext");
			table.boolean("locked").defaultTo(false);
			table.boolean("published").defaultTo(false);
			table.boolean("head").defaultTo(false);
			table.boolean("previous_revision").nullable();
			table.timestamps();
		});
	}

	down() {
		this.drop("revisions");
	}
}

module.exports = RevisionSchema;
