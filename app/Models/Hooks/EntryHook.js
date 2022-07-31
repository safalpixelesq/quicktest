"use strict";

const EntryHook = (exports = module.exports = {});
const uuid = use("uuid");
const EntryModel = use("App/Models/Entry");

EntryHook.addUUID = (entryInstance) => {
	entryInstance.uuid = uuid.v4();
};

EntryHook.resolveReferences = async (entryInstance) => {
	// if (!Array.isArray(entryInstance)) {
	// 	entryInstance = [entryInstance];
	// }
	// for (const entry of entryInstance) {
	// 	const content = JSON.parse(entry.json_content);
	// 	entry.parsed_content = await fillInRefernce(content);
	// }
};

async function fillInRefernce(content) {
	for (let key in content) {
		const value = content[key];
		const entryRefId =
			typeof value === "string" ? value.split("$pq_reference_")[1] : null;
		if (entryRefId) {
			content[key] = await getEntryContent(entryRefId);
		}
		if (typeof value === "object" && value !== null) {
			fillInRefernce(value);
		}
	}
	return content;
}

async function getEntryContent(entryId) {
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
