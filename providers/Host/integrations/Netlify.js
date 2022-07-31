const Logger = use("Logger");
const crypto = require("crypto");

class Netlify {
	async client(accessToken) {
		const { NetlifyAPI } = await import("netlify");
		return new NetlifyAPI(accessToken);
	}

	async createDeploy(client, siteId, files) {
		const deploy = await client.createSiteDeploy({
			site_id: siteId,
			body: {
				files,
			},
		});
		return deploy;
	}

	async uploadDeployFile(client, deployId, path, content) {
		const upload = await client.uploadDeployFile({
			deploy_id: deployId,
			path: path,
			body: content,
		});
		return upload;
	}

	async getSiteFiles(client, siteId) {
		const files = await client.listSiteFiles({
			site_id: siteId,
		});
		return files.reduce((acc, file) => {
			return {
				...acc,
				[file.path]: file.sha,
			};
		}, {});
	}

	async publish(pages, credentials) {
		const client = await this.client(credentials.accessToken);
		const siteFiles = await this.getSiteFiles(client, credentials.siteId);

		const updatedFiles = pages.reduce((acc, page) => {
			return {
				...acc,
				[page.model.filePath]: this.getStringHash(page.html),
			};
		}, {});

		const deploy = await this.createDeploy(client, credentials.siteId, {
			...siteFiles,
			...updatedFiles,
		});
		for (const page of pages) {
			await this.uploadDeployFile(
				client,
				deploy.id,
				page.model.filePath,
				page.html
			);
		}

		Logger.info("Netlify publish completed");
	}

	async delete(pages, credentials) {
		const client = await this.client(credentials.accessToken);
		const siteFiles = await this.getSiteFiles(client, credentials.siteId);

		pages.forEach((page) => {
			delete siteFiles[page.model.filePath];
		});

		await this.createDeploy(client, credentials.siteId, siteFiles);

		Logger.info("Netlify delete completed");
	}

	getStringHash(content) {
		return crypto.createHash("sha1").update(content).digest("hex");
	}
}

module.exports = Netlify;
