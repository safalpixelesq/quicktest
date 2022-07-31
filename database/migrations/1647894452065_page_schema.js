"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PageSchema extends Schema {
	up() {
		this.table("pages", (table) => {
			table.string("title", 500).notNullable();
			table
				.integer("template_id")
				.unsigned()
				.references("id")
				.inTable("templates")
				.onDelete("CASCADE");
		});
	}

	down() {
		this.table("pages", (table) => {
			table.dropColumn("title");
			table.dropForeign("template_id");
		});
	}
}

module.exports = PageSchema;
