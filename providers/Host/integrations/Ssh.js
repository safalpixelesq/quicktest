const Logger = use("Logger");
const Drive = use("Drive");
const Helpers = use("Helpers");
const { NodeSSH } = require("node-ssh");

class Ssh {
	constructor() {
		this.ssh = new NodeSSH();
	}

	async client(host, username, privateKey) {
		const client = await this.ssh.connect({
			host,
			username,
			privateKey,
		});
		return client;
	}

	async publish(pages, credentials) {
		const client = await this.client(
			credentials.host,
			credentials.username,
			credentials.privateKey
		);

		for (const page of pages) {
			await Drive.put(page.model.uuid, Buffer.from(page.html));

			await client.putFiles([
				{
					local: `${Helpers.tmpPath()}/${page.model.uuid}`,
					remote: `${credentials.workingDir || "."}/${
						page.model.filePath
					}`,
				},
			]);

			await Drive.delete(page.model.uuid);
		}

		Logger.info("SSH publish completed");
	}

	async delete(pages, credentials) {
		const client = await this.client(
			credentials.host,
			credentials.username,
			credentials.privateKey
		);

		for (const page of pages) {
			const { stderr } = await client.execCommand(
				`rm ${credentials.workingDir || "."}/${page.model.filePath}`
			);
			if (stderr) {
				throw new Error(stderr);
			}
		}

		Logger.info("SSH delete completed");
	}
}

module.exports = Ssh;
