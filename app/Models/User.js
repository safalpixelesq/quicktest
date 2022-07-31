"use strict";

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
	static boot() {
		super.boot();

		this.addHook("beforeCreate", [
			"UserHook.setDefaults",
			"UserHook.hashPassword",
		]);
		this.addHook("afterCreate", ["UserHook.createProfile"]);
		// this.addHook('beforeSave', ['UserHook.hashPassword']);
	}

	static get primaryKey() {
		return "id";
	}

	/**
	 * A relationship on tokens is required for auth to
	 * work. Since features like `refreshTokens` or
	 * `rememberToken` will be saved inside the
	 * tokens table.
	 *
	 * @method tokens
	 *
	 * @return {Object}
	 */
	tokens() {
		return this.hasMany("App/Models/Token");
	}

	profile() {
		return this.hasOne("App/Models/Profile");
	}

	// roles
	static get roles() {
		return ["superadmin", "admin", "member"];
	}

	// projects
	projects() {
		return this.belongsToMany("App/Models/Project", "user_id", "project_id")
			.pivotTable("user_projects")
			.withTimestamps();
	}

	pages() {
		return this.hasMany("App/Models/Page", "id", "author_id");
	}

	// hide fields
	static get hidden() {
		return [
			"password",
			"reset_token",
			"confirmation_token",
			"verified",
			"banned",
			"onboarded",
			"stripe_cus_id",
			"provider",
			"firstSubscription",
			"payment_failed",
			"id",
			"uid",
			"created_at",
			"updated_at",
			"google_id",
			"github_id",
			"twitter_id",
		];
	}
}

module.exports = User;
