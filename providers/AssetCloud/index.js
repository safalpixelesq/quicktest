"use strict";

const cloudinary = require("cloudinary");

class AssetCloud {
	constructor(Config) {
		this.Config = Config.get("assetCloud") || {};
		this.cloudinary = cloudinary;
		this.cloudinary.config(this.Config.cloudinary);
	}

	upload(data) {
		return new Promise((resolve, reject) => {
			this.cloudinary.v2.uploader.upload(
				data.filePath,
				{
					public_id: data.cloudFileName,
					folder: data.cloudFolder,
				},
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		});
	}

	list(cloudFolder, fileName, next_cursor) {
		return this.cloudinary.v2.search
			.expression(
				`type:upload AND folder:${cloudFolder}/* ${
					fileName ? `AND filename:${fileName}*` : ""
				}`
			)
			.next_cursor(next_cursor)
			.max_results(13)
			.execute();
	}
}

module.exports = AssetCloud;
