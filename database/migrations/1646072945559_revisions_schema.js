"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RevisionsSchema extends Schema {
	up() {
		this.table("revisions", (table) => {
			table.integer("previous_revision").alter();
		});
	}

	down() {
		this.table("revisions", (table) => {
			// reverse alternations
		});
	}
}

module.exports = RevisionsSchema;
