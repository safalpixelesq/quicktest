"use strict";

/*
|--------------------------------------------------------------------------
| AvisoTestSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class AvisoTestSeeder {
	async run() {
		await Database.table("projects").insert({
			name: "Aviso Test",
			slug: "aviso-test",
			icon: "https://assets.uiaas.io/web/aviso/aviso-web.png",
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("settings").insert({
			project_id: 3,
			theme_id: 2,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("user_projects").insert({
			user_id: 1,
			project_id: 3,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("user_projects").insert({
			user_id: 2,
			project_id: 3,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("user_projects").insert({
			user_id: 3,
			project_id: 3,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("user_projects").insert({
			user_id: 4,
			project_id: 3,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = AvisoTestSeeder;
