"use strict";

const Logger = use("Logger");
const CollectionService = use("Collection");

class CollectionController {
	async show({ params, request, response }) {
		try {
			const collection = await CollectionService.get(
				request.project,
				params.collection
			);

			response.status(200).json({
				message: "Project collection data",
				data: collection,
			});
		} catch (error) {
			Logger.error("Collection show failed", error);
			response.status(400).json({
				status: "error",
				message: "Error getting collection data",
			});
		}
	}

	async index({ request, response }) {
		try {
			const collections = await CollectionService.list(request.project);
			return response.status(200).json({
				message: "Project collections",
				data: collections,
			});
		} catch (error) {
			Logger.error("Collection index failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error indexing collection data",
			});
		}
	}

	async create({ request, response }) {
		try {
			const { collectionData } = request.post();
			const collection = await CollectionService.create(
				request.project,
				collectionData
			);

			response.status(201).json({
				message: "Collection created",
				data: collection,
			});
		} catch (error) {
			console.log(error);
			Logger.error("Collection create failed", error.message);
			response.status(400).json({
				status: "error",
				message: "Error creating collection",
			});
		}
	}

	async update({ request, params, response }) {
		try {
			const { collectionData } = request.post();
			await CollectionService.update(request.project, {
				collectionData,
				collectionSlug: params.collection,
			});

			const collection = await CollectionService.get(
				request.project,
				params.collection
			);

			response.status(200).json({
				message: "Collection updated",
				data: collection,
			});
		} catch (error) {
			Logger.error("Collection update failed", error);
			response.status(400).json({
				status: "error",
				message: "Error saving collection data",
			});
		}
	}

	async delete({ request, params, response }) {
		try {
			await CollectionService.delete(request.project, params.collection);
			const collections = await CollectionService.list(request.project);

			response.status(200).json({
				message: "Collection deleted",
				data: collections,
			});
		} catch (error) {
			Logger.error("Collection delete failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not delete collection",
			});
		}
	}

	async formService({ request, params, response }) {
		try {
			let resData = "";
			switch (params.service) {
				case "validation":
					resData = await CollectionService.validate(
						request.project,
						request.get()
					);
			}
			response.status(200).json({
				message: "Success",
				data: resData,
			});
		} catch (error) {
			Logger.error("Form service error", error);
			response.status(400).json({
				status: "error",
				message: "Form service error",
			});
		}
	}
}

module.exports = CollectionController;
