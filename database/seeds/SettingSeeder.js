"use strict";

/*
|--------------------------------------------------------------------------
| SettingSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class SettingSeeder {
	async run() {
		await Database.table("settings").insert({
			project_id: 1,
			theme_id: 1,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("settings").insert({
			project_id: 2,
			theme_id: 2,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = SettingSeeder;
