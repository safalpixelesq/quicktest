"use strict";

const PageHook = (exports = module.exports = {});
const uuid = use("uuid");

PageHook.addUUID = async (pageInstance) => {
	pageInstance.uuid = uuid.v4();
};

PageHook.addDefaultRevisions = async (pageInstance) => {
	if (Array.isArray(pageInstance)) {
		for (const page of pageInstance) {
			page.publishedRevision = await page
				.revisions()
				.where("published", true)
				.fetch();
			page.draftRevision = await page
				.revisions()
				.where("head", true)
				.where("locked", false)
				.fetch();
		}
	}
};
