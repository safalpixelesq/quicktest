"use strict";

const Logger = use("Logger");
const EntryService = use("Entry");

class EntryController {
	async index({ request, response }) {
		try {
			const { pageNum, search = "", pageIndex } = request.get();
			const entries = await EntryService.list(
				request.collection,
				{
					pageNum,
					search,
				},
				{
					pageIndex,
				}
			);

			return response.status(200).json({
				message: "Project entries",
				data: entries,
			});
		} catch (error) {
			Logger.error("Entry index failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error indexing entry data",
			});
		}
	}

	async sample({ request, response }) {
		try {
			const entry = await EntryService.sample(request.collection);

			return response.status(200).json({
				message: "Project entry data",
				data: entry,
			});
		} catch (error) {
			Logger.error("Entry show failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error getting entry data",
			});
		}
	}

	async show({ request, params, response }) {
		try {
			const entry = await EntryService.get(
				request.collection,
				params.entry_id
			);

			return response.status(200).json({
				message: "Project entry data",
				data: entry,
			});
		} catch (error) {
			Logger.error("Entry show failed", error.message);
			return response.status(400).json({
				status: "error",
				message: "Error getting entry data",
			});
		}
	}

	async create({ request, response, auth }) {
		try {
			const { entryData, pageData, metaData, themeData } = request.post();

			const entry = await EntryService.create(request.collection, {
				entryData,
				pageData,
				metaData,
				themeData,
				loggedInUser: auth.current.user,
				project: request.project,
			});

			return response.status(201).json({
				message: "Entry created",
				data: entry,
			});
		} catch (error) {
			Logger.error("Entry create failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error creating entry data",
			});
		}
	}

	async update({ request, params, response, auth }) {
		try {
			const { entryData } = request.post();
			await EntryService.update(request.collection, {
				entryData,
				entryId: params.entry_id,
				project: request.project,
				loggedInUser: auth.current.user,
			});

			const entry = await EntryService.get(
				request.collection,
				params.entry_id
			);

			return response.status(200).json({
				message: "Entry updated",
				data: entry,
			});
		} catch (error) {
			Logger.error("Entry update failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error updating entry data",
			});
		}
	}

	async delete({ request, params, response }) {
		try {
			await EntryService.delete(request.collection, params.entry_id);
			const entries = await EntryService.list(request.collection, {
				pageNum: 1,
				search: "",
			});

			response.status(200).json({
				message: "Entry deleted",
				data: entries,
			});
		} catch (error) {
			Logger.error("Entry delete failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not delete entry",
			});
		}
	}
}

module.exports = EntryController;
