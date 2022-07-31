"use strict";

/*
|--------------------------------------------------------------------------
| RevisionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class RevisionSeeder {
	async run() {
		await Database.table("revisions").insert({
			author_id: 1,
			page_id: 1,
			json_content: null,
			previous_revision: null,
			head: true,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("revisions").insert({
			author_id: 1,
			page_id: 2,
			json_content: null,
			previous_revision: null,
			head: true,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = RevisionSeeder;
