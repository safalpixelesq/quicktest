"use strict";

const Logger = use("Logger");
const Fractal = use("Fractal");
const _ = require("lodash");
const Partial = use("App/Models/Partial");
const RevisionHook = (exports = module.exports = {});

RevisionHook.deleteOldRevision = async (revisionInstance) => {
	const pageInstance = await revisionInstance.page().fetch();
	const totalRevisions = await pageInstance.revisions().getCount();
	if (totalRevisions > 5) {
		let allRevisions = await pageInstance
			.revisions()
			.orderBy("created_at", "desc")
			.fetch();

		for (let rev of allRevisions.rows.slice(5, allRevisions.rows.length)) {
			Logger.info(
				`Deleting revision ${rev.id} of page ${pageInstance.id}`
			);
			await rev.delete();
		}
	}
};

RevisionHook.updateRevisionHistory = async (revisionInstance) => {
	const pageInstance = await revisionInstance.page().fetch();
	// find current head
	let currentHead = await pageInstance
		.revisions()
		.where("head", true)
		.fetch();
	currentHead = currentHead.toJSON();
	// update current head to false
	await pageInstance.revisions().where("head", true).update({ head: false });

	// update newly create revision
	revisionInstance.head = true;

	if (currentHead && currentHead[0]) {
		revisionInstance.previous_revision = currentHead[0].id;
	}
	await revisionInstance.save();
};

RevisionHook.addHTMLStr = async (revisionInstance) => {
	if (revisionInstance.json_content) {
		const json_content =
			typeof revisionInstance.json_content === "string"
				? JSON.parse(revisionInstance.json_content)
				: revisionInstance.json_content;
		const uikitFractal = Fractal.getFractalInstance("uikit");
		for (const content of json_content) {
			if (!content.isPartial && content.context && !content.htmlstr) {
				Logger.info(`Generating render for ${content.context.module}`);
				content.htmlstr = await Fractal.getRender(uikitFractal, [
					_.cloneDeep(content.context),
				]);
			}
		}
		revisionInstance.json_content = json_content;
	}
};
