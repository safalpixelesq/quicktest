"use strict";

const PartialHook = (exports = module.exports = {});
const uuid = use("uuid");
const Fractal = use("Fractal");
const _ = require("lodash");

PartialHook.addUUID = (partialInstance) => {
	partialInstance.uuid = uuid.v4();
};

PartialHook.addHTMLStr = async (partialInstance) => {
	if (partialInstance.json_content) {
		const json_content =
			typeof partialInstance.json_content === "string"
				? JSON.parse(partialInstance.json_content)
				: partialInstance.json_content;
		const uikitFractal = Fractal.getFractalInstance("uikit");
		for (const content of json_content) {
			if (content.context && !content.htmlstr) {
				Logger.info(`Generating render for ${content.context.module}`);
				content.htmlstr = await Fractal.getRender(uikitFractal, [
					_.cloneDeep(content.context),
				]);
			}
		}

		partialInstance.json_content = json_content;
	}
};
