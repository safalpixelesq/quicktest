"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Integration extends Model {
	getCredentials(credentials) {
		return JSON.parse(credentials);
	}

	setCredentials(credentials) {
		return JSON.stringify(credentials);
	}
}

module.exports = Integration;
