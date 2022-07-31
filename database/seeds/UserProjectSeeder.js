"use strict";

/*
|--------------------------------------------------------------------------
| UserProjectSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class UserProjectSeeder {
	async run() {
		await Database.table("user_projects").insert({
			user_id: 1,
			project_id: 1,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 1,
			project_id: 2,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 2,
			project_id: 1,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 2,
			project_id: 2,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 3,
			project_id: 1,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 3,
			project_id: 2,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 4,
			project_id: 1,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 4,
			project_id: 2,
			role: "ADMIN",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 5,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 6,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 7,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 8,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 9,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 10,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 11,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 12,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
		await Database.table("user_projects").insert({
			user_id: 13,
			project_id: 2,
			role: "MEMBER",
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = UserProjectSeeder;
