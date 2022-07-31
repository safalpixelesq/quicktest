"use strict";

const Netlify = require("./integrations/Netlify.js");
const Ssh = require("./integrations/Ssh.js");

class Host {
	constructor() {
		this.netlify = new Netlify();
		this.ssh = new Ssh();
	}

	async publish(pages, integration) {
		await this[integration.type.toLowerCase()].publish(
			pages,
			integration.credentials
		);
	}

	async delete(pages, integration) {
		await this[integration.type.toLowerCase()].delete(
			pages,
			integration.credentials
		);
	}
}

module.exports = Host;
