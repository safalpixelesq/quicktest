const Partial = use("App/Models/Partial");

class PartialHelper {
	static async createDefaults(user, project) {
		const header = await Partial.create({
			name: "global-header",
		});
		await header.author().associate(user);
		await header.project().associate(project);

		const footer = await Partial.create({
			name: "global-footer",
		});
		await footer.author().associate(user);
		await footer.project().associate(project);
	}
}

module.exports = PartialHelper;
