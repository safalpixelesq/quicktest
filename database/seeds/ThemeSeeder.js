"use strict";

/*
|--------------------------------------------------------------------------
| ThemeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class ThemeSeeder {
	async run() {
		const themes = await Database.table("themes").where(
			"system_default",
			true
		);
		if (!themes.some((theme) => theme.name === "pixelesq")) {
			await Database.table("themes").insert({
				name: "pixelesq",
				system_default: true,
				created_at: new Date(),
				updated_at: new Date(),
			});
			console.log("Pixelesq theme seeded");
		}
		if (!themes.some((theme) => theme.name === "aviso")) {
			await Database.table("themes").insert({
				name: "aviso",
				system_default: true,
				created_at: new Date(),
				updated_at: new Date(),
			});
			console.log("Aviso theme seeded");
		}
	}
}

module.exports = ThemeSeeder;
