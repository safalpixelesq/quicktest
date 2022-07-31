"use strict";
const slugify = require("slugify");

class Collection {
	/**
	 * Get a collection in a project
	 */
	async get(project, collectionSlug) {
		const collection = await project
			.collections()
			.where("slug", collectionSlug)
			.where("deleted", false)
			.with("template")
			.fetch();

		return collection.rows[0];
	}

	/**
	 * Get a list of collections in a project
	 */
	async list(project) {
		const collections = await project
			.collections()
			.where("deleted", false)
			.withCount("entries", (builder) => {
				builder.where("deleted", false);
			})
			.orderBy("updated_at", "desc")
			.fetch();

		return collections;
	}

	/**
	 * Create a collection in a project
	 */
	async create(project, collectionData) {
		const existingCollection = await project
			.collections()
			.where("deleted", false)
			.where("slug", collectionData.slug)
			.fetch();

		if (existingCollection.rows[0]) {
			throw new Error("Duplicate collection slug");
		}

		const collection = await project.collections().create(collectionData);

		return collection;
	}

	/**
	 * Create a collection in a project
	 */
	async update(project, payload) {
		const { field_schema } = payload.collectionData;

		const collection = await project
			.collections()
			.where("slug", payload.collectionSlug)
			.where("deleted", false)
			.update({ field_schema: JSON.stringify(field_schema) });

		return collection;
	}

	/**
	 * Delete a collection from project
	 */
	async delete(project, collectionSlug) {
		const result = await project
			.collections()
			.where("slug", collectionSlug)
			.update({ deleted: true });

		return result;
	}

	/**
	 * Validae a collection field
	 */

	async validate(project, payload = {}) {
		if (payload.type === "unique-slug") {
			const count = await project
				.collections()
				.where("slug", payload.value)
				.where("deleted", false)
				.getCount();
			return count === 0;
		}

		return false;
	}
}

module.exports = Collection;
