"use strict";

const EntryService = use("Entry");

class Template {
	/**
	 * Get a template in a project
	 */
	async get(project, templateId) {
		const template = await project
			.templates()
			.where("uuid", templateId)
			.where("deleted", false)
			.with("author")
			.with("collection")
			.fetch();

		return template.rows[0];
	}

	/**
	 * Get a list of templates in a project
	 */
	async list(project) {
		const templates = await project
			.templates()
			.where("deleted", false)
			.with("author")
			.orderBy("updated_at", "desc")
			.fetch();

		return templates;
	}

	/**
	 * Create a template in a project
	 */
	async create(project, payload) {
		const { templateData, collectionId, loggedInUser } = payload;
		const template = await project.templates().create(templateData);
		await template.author().associate(loggedInUser);

		if (collectionId) {
			const collection = await project
				.collections()
				.where("id", collectionId)
				.fetch();
			await template.collection().associate(collection.rows[0]);
		}

		return template;
	}

	/**
	 * Update a template in a project
	 */
	async update(project, payload) {
		const { json_content } = payload.templateData;
		let template = await project
			.templates()
			.where("uuid", payload.templateId)
			.where("deleted", false)
			.fetch();

		template = template.rows[0];
		template.json_content = json_content;

		await template.save();

		// update all pages if collection template
		if (payload.updatePages) {
			const collection = await template.collection().fetch();
			if (collection.has_pages) {
				await EntryService.refreshEntryPages(collection, {
					project,
					loggedInUser: payload.loggedInUser,
				});
			}
		}
		return template;
	}

	/**
	 * Delete a template from project
	 */
	async delete(project, templateId) {
		const result = await project
			.templates()
			.where("uuid", templateId)
			.update({ deleted: true });

		return result;
	}
}

module.exports = Template;
