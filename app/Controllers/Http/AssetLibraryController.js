"use strict";

const Logger = use("Logger");
const slugify = require("slugify");
const AssetCloud = use("Asset/Cloud");

class AssetLibraryController {
	async list({ request, response }) {
		try {
			const { folder, file, next_cursor } = request.get();
			const list = await AssetCloud.list(folder, file, next_cursor);
			response.status(200).json({
				message: "Assets",
				data: list,
			});
		} catch (error) {
			Logger.error("Asset list failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not list the assets",
			});
		}
	}

	async upload({ request, response }) {
		try {
			const { folder } = request.post();
			const file = request.file("file");
			if (!file || !folder) {
				throw new Error("Bad inputs");
			}
			const uploadResponse = await AssetCloud.upload({
				filePath: file.tmpPath,
				cloudFileName: this.generateFileName(file),
				cloudFolder: folder,
			});

			response.status(201).json({
				message: "Asset uploaded",
				data: uploadResponse,
			});
		} catch (error) {
			Logger.error("Asset upload failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not upload the asset",
			});
		}
	}

	generateFileName(file) {
		const name = file.clientName.replace(
			new RegExp(`\\.${file.extname}$`),
			`-${Date.now()}`
		);
		return slugify(name, { lower: true });
	}
}

module.exports = AssetLibraryController;
