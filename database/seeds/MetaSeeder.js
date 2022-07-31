"use strict";

/*
|--------------------------------------------------------------------------
| MetaSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class MetaSeeder {
	async run() {
		await Database.table("metas").insert({
			title: "Home",
			page_id: 1,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("metas").insert({
			title: "Home",
			page_id: 2,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = MetaSeeder;
