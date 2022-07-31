"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class IntegrationSchema extends Schema {
	up() {
		this.create("integrations", (table) => {
			table.increments();
			table.string("type").notNullable();
			table.text("credentials").notNullable();
			table
				.integer("setting_id")
				.unsigned()
				.references("id")
				.inTable("settings")
				.onDelete("SET NULL");
			table.timestamps();
		});
	}

	down() {
		this.drop("integrations");
	}
}

module.exports = IntegrationSchema;
