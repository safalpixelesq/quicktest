"use strict";

const Env = use("Env");
const uuid = use("uuid");
const Hash = use("Hash");
/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class UserSeeder {
	async run() {
		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Devanand",
			email: "devanand@pixelesq.com",
			password: `${await Hash.make(Env.get("USER_1_PD"))}`,
			role: "ADMIN",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Sumana",
			email: "sumana@pixelesq.com",
			password: `${await Hash.make(Env.get("USER_2_PD"))}`,
			role: "ADMIN",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Praneet",
			email: "praneeth@pixelesq.com",
			password: `${await Hash.make(Env.get("USER_3_PD"))}`,
			role: "ADMIN",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Safal",
			email: "safal@pixelesq.com",
			password: `${await Hash.make(Env.get("USER_4_PD"))}`,
			role: "ADMIN",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Amit Pande",
			email: "amit.pande@aviso.com",
			password: `${await Hash.make(Env.get("USER_5_PD"))}`,
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Abishek",
			password: `${await Hash.make("Abishek@aviso")}`,
			email: "abishek.allapanda@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Aniroodh",
			password: `${await Hash.make("Aniroodh@aviso")}`,
			email: "aniroodh.n@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Gayatri",
			password: `${await Hash.make("Gayatri@aviso")}`,
			email: "gayatri.ivaturi@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Kashyap",
			password: `${await Hash.make("Kashyap@aviso")}`,
			email: "kashyap.kaushikbhai@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Ketan",
			password: `${await Hash.make("Ketan@aviso")}`,
			email: "ketan.pathki@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Leelachaitanya",
			password: `${await Hash.make("Leelachaitanya@aviso")}`,
			email: "leelachaitanya.s@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Rahul",
			password: `${await Hash.make("Rahul@aviso")}`,
			email: "rahul.kumar@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await Database.table("users").insert({
			uid: uuid.v4(),
			username: "Sriram",
			password: `${await Hash.make("Sriram@aviso")}`,
			email: "sriram.kothandaraman@aviso.com",
			role: "MEMBER",
			verified: true,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
}

module.exports = UserSeeder;
