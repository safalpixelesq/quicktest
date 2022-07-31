"use strict";

/*
|--------------------------------------------------------------------------
| ProjectSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class ProjectSeeder {
	async run() {
		await Database.table("projects").insert({
			name: "Pixelesq",
			slug: "pixelesq",
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("projects").insert({
			name: "Aviso",
			slug: "aviso",
			icon: "https://assets.uiaas.io/web/aviso/aviso-web.png",
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = ProjectSeeder;
