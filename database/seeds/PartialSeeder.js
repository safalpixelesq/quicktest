"use strict";

/*
|--------------------------------------------------------------------------
| PartialSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const uuid = use("uuid");

class PartialSeeder {
	async run() {
		await Database.table("partials").insert({
			uuid: uuid.v4(),
			name: "global-header",
			json_content: null,
			author_id: 1,
			project_id: 1,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("partials").insert({
			uuid: uuid.v4(),
			name: "global-footer",
			json_content: null,
			author_id: 1,
			project_id: 1,
			created_at: new Date(),
			updated_at: new Date(),
		});
		// await Database.table("partials").insert({
		// 	uuid: uuid.v4(),
		// 	name: "global-header",
		// 	json_content: null,
		// 	author_id: 1,
		// 	project_id: 2,
		// 	created_at: new Date(),
		// 	updated_at: new Date(),
		// });

		// await Database.table("partials").insert({
		// 	uuid: uuid.v4(),
		// 	name: "global-footer",
		// 	json_content: null,
		// 	author_id: 1,
		// 	project_id: 2,
		// 	created_at: new Date(),
		// 	updated_at: new Date(),
		// });
	}
}

module.exports = PartialSeeder;
