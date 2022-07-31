"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EntrySchema extends Schema {
	up() {
		this.create("entries", (table) => {
			table.increments();
			table.uuid("uuid").unique().notNullable();
			table.string("label").notNullable();
			table.text("json_content", "longtext");
			table.boolean("deleted").defaultTo(false);
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
			table
				.integer("collection_id")
				.unsigned()
				.references("id")
				.inTable("collections")
				.onDelete("CASCADE");
			table.timestamps();
		});
	}

	down() {
		this.drop("entries");
	}
}

module.exports = EntrySchema;
