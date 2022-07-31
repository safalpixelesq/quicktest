"use strict";

const TemplateHook = (exports = module.exports = {});
const uuid = use("uuid");

TemplateHook.addUUID = (templateInstance) => {
	templateInstance.uuid = uuid.v4();
};
