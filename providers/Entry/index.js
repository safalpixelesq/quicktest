"use strict";

const _ = require("lodash");
const EntryModel = use("App/Models/Entry");
const PageService = use("Page");

class Entry {
	/**
	 * Get a sample entry in a collection
	 */
	async sample(collection) {
		let entry = await collection.entries().where("deleted", false).first();
		entry = entry.toJSON();
		entry.json_content = await this.fillInRefernce(entry.json_content);

		return entry;
	}

	/**
	 * Get a entry in a collection
	 */
	async get(collection, entryId) {
		let entry = await collection
			.entries()
			.where("uuid", entryId)
			.where("deleted", false)
			.with("author")
			.with("page")
			.fetch();

		entry = entry.rows[0];
		return entry;
	}

	/**
	 * Get a list of entries in a collection
	 */
	async list(collection, payload, options = {}) {
		if (options.pageIndex) {
			let pageIndexEntries = await collection
				.entries()
				.where("deleted", false)
				.with("page.revisions", (builder) => {
					builder.where("published", true);
				})
				.fetch();
			pageIndexEntries = pageIndexEntries.toJSON();

			if (collection.has_pages) {
				pageIndexEntries = pageIndexEntries.filter(
					(e) => e.page && e.page.revisions.length > 0
				);
			}
			for (let entry of pageIndexEntries) {
				entry.json_content = await this.fillInRefernce(
					entry.json_content
				);
				delete entry.page;
			}
			return pageIndexEntries;
		}
		const entries = await collection
			.entries()
			.where("deleted", false)
			.where("label", "LIKE", `%${payload.search}%`)
			.with("author")
			.with("page")
			.orderBy("updated_at", "desc")
			.paginate(payload.pageNum);

		return entries;
	}

	/**
	 * Create a entry in a collection
	 */
	async create(collection, payload) {
		const {
			entryData,
			pageData,
			metaData,
			themeData,
			loggedInUser,
			project,
		} = payload;

		// create page
		const page =
			collection.has_pages &&
			(await PageService.create(project, {
				loggedInUser,
				pageData,
				metaData,
				themeData,
				revisionData: {},
			}));

		// create entry
		const entry = await collection.entries().create(entryData);

		page && (await entry.page().associate(page));
		await entry.author().associate(loggedInUser);

		return entry;
	}

	/**
	 * Create a entry in a collection
	 */
	async update(collection, payload) {
		const {
			entryData,
			loggedInUser,
			entryId,
			project,
			options = {},
		} = payload;
		let entry = await collection
			.entries()
			.where("uuid", entryId)
			.where("deleted", false)
			.fetch();
		entry = entry.rows[0];
		if (entryData) {
			entry.label = entryData.label || entry.label;
			entry.json_content = entryData.json_content || entry.json_content;
			await entry.save();
		}

		if (collection.has_pages) {
			// fill in entry references before template fill
			const renderReadyEntryData = await this.fillInRefernce(
				JSON.parse(entry.json_content)
			);

			const entryTemplate = await this.getEntryTemplate(
				renderReadyEntryData,
				collection
			);

			const page = await entry.page().fetch();
			const revisionData = entryTemplate
				? {
						json_content: entryTemplate.map((c) => ({
							context: c.context,
						})),
				  }
				: null;
			await PageService.update(project, {
				pageId: page.uuid,
				revisionData,
				loggedInUser: loggedInUser,
				publishPage: options.publishPage || false,
				options: { disableNewRevision: true },
			});
		}

		return entry;
	}

	/**
	 * Delete a entry from collection
	 */
	async delete(collection, entryId) {
		let entry = await collection.entries().where("uuid", entryId).fetch();
		entry = entry.rows[0];
		entry.deleted = true;
		await entry.save();
		if (collection.has_pages) await entry.page().update({ deleted: true });
		return entry;
	}

	async refreshEntryPages(collection, payload) {
		let entries = await collection
			.entries()
			.where("deleted", false)
			.fetch();
		entries = entries.toJSON();
		for (const entry of entries) {
			this.update(collection, {
				entryData: { json_content: entry.json_content },
				loggedInUser: payload.loggedInUser,
				entryId: entry.uuid,
				project: payload.project,
			});
		}
	}

	/**
	 * Get the template context of an entry
	 */
	async getEntryTemplate(entryData, collectionInstance) {
		try {
			let template = await collectionInstance.template().fetch();
			if (!template) {
				return null;
			}
			template = template.toJSON();
			return this.fillInConnection(entryData, template.json_content);
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	/**
	 * Plug in the template connections
	 */
	fillInConnection(source, json_content) {
		json_content.forEach((content) => {
			if (content.connection) {
				for (const path in content.connection) {
					const connectionValue = content.connection[path];
					if (typeof connectionValue === "string") {
						_.set(
							content,
							path,
							this.getConnectionValue(source, connectionValue)
						);
					}

					if (typeof connectionValue === "object") {
						const newItems = [];
						const defaultContent = _.get(content, path);
						const sourceData = Array.isArray(
							source[connectionValue.path]
						)
							? source[connectionValue.path]
							: [source[connectionValue.path]];
						for (const i in sourceData) {
							newItems[i] = _.cloneDeep(defaultContent[0]);
							for (const subPath in connectionValue.connection) {
								_.set(
									newItems[i],
									subPath,
									_.get(
										sourceData,
										`[${i}]${connectionValue.connection[subPath]}`
									)
								);
							}
						}

						_.set(content, path, newItems);
					}
				}
			}
		});

		return json_content;
	}

	getConnectionValue(source, rawValue) {
		const connectedField = rawValue
			.split(" ")
			.find((s) => s.startsWith("$pq_connect"));
		return rawValue.replace(
			new RegExp(connectedField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
			_.get(source, connectedField.split("$pq_connect_")[1])
		);
	}

	async fillInRefernce(content) {
		for (let key in content) {
			const value = content[key];
			const entryRefId =
				typeof value === "string"
					? value.split("$pq_reference_")[1]
					: null;
			if (entryRefId) {
				content[key] = await this.getEntryContent(entryRefId);
			}

			if (typeof value === "object" && value !== null) {
				await this.fillInRefernce(value);
			}
		}

		return content;
	}

	async getEntryContent(entryId) {
		try {
			const entry = await EntryModel.query()
				.where("uuid", entryId)
				.where("deleted", false)
				.fetch();

			return JSON.parse(entry.rows[0].json_content);
		} catch (err) {
			console.log(err);
			return {};
		}
	}
}

module.exports = Entry;
