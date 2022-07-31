"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MetaSchema extends Schema {
	up() {
		this.create("metas", (table) => {
			table.increments();
			table.string("title", 500).notNullable();
			table.text("description", "longtext").nullable();
			table.boolean("index").defaultTo(true);
			table.boolean("translate").defaultTo(false);
			table.string("theme").nullable();
			table.string("image").nullable();
			table.text("json_ld", "longtext").nullable();
			table
				.integer("page_id")
				.unsigned()
				.references("id")
				.inTable("pages")
				.onDelete("CASCADE");
			table.timestamps();
		});
	}

	down() {
		this.drop("metas");
	}
}

module.exports = MetaSchema;
