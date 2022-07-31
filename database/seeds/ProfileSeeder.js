"use strict";

/*
|--------------------------------------------------------------------------
| ProfileSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class ProfileSeeder {
	async run() {
		await Database.table("profiles").insert({
			user_id: 1,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 2,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 3,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 4,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 5,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 6,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 7,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 8,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 9,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 10,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 11,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 12,
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("profiles").insert({
			user_id: 13,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = ProfileSeeder;
