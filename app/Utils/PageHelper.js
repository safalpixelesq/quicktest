const Page = use("App/Models/Page");
const Meta = use("App/Models/Meta");
const PageService = use("Page");
var AdmZip = require("adm-zip");
class PageHelper {
	static async createDefaults(user, project) {
		const page = await Page.create({
			slug: "/",
			title: "Home",
		});
		const meta = await Meta.create({
			title: "Home",
			description: "This is the home page",
		});

		await page.meta().save(meta);
		await page.author().associate(user);
		await page.project().associate(project);

		const revision = await page.revisions().create({});
		await revision.author().associate(user);
	}

	static async downloadPages(project) {
		const zip = new AdmZip();
		const pages = await project.pages().where("deleted", false).fetch();
		for (const page of pages.rows) {
			try {
				const pageJSON = page.toJSON();
				const htmlPage = await PageService.getHTML(page);

				if (htmlPage && pageJSON.filePath) {
					zip.addFile(
						`${project.slug}_${project.id}/${pageJSON.filePath}`,
						Buffer.from(htmlPage, "utf8")
					);

					console.log(
						`Downloaded ${pageJSON.uuid}: ${pageJSON.slug}`
					);
				}
			} catch (error) {
				console.log(
					`Skipping download ${page.uuid}: ${page.slug} - ${error.message}`
				);
			}
		}

		return zip.toBuffer();
	}
}

module.exports = PageHelper;
