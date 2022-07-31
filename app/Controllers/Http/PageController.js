"use strict";

const Env = use("Env");
const Logger = use("Logger");
const Fractal = use("Fractal");
const PageService = use("Page");
const Project = use("App/Models/Project");
const Page = use("App/Models/Page");
const Partial = use("App/Models/Partial");
const Meta = use("App/Models/Meta");
const Constants = use("App/Utils/Constants");
const Activity = use("App/Models/Activity");
const Database = use("Database");

class PageController {
	async getPage({ request, params, response }) {
		try {
			const page = await PageService.get(request.project, params.pageid);

			response.status(200).json({
				message: "Project pages",
				data: page,
			});
		} catch (error) {
			Logger.error("Page request failed", error);
			response.status(400).json({
				status: "error",
				message: "Error getting page data",
			});
		}
	}

	async index({ request, response }) {
		try {
			const { pageNum, search = "" } = request.get();
			const pages = await PageService.list(request.project, {
				pageNum,
				search,
			});

			return response.status(200).json({
				message: "Project pages",
				data: pages,
			});
		} catch (error) {
			Logger.error("Pages index failed", error);
			return response.status(400).json({
				status: "error",
				message: "Error indexing page data",
			});
		}
	}

	async create({ request, response, auth }) {
		try {
			const {
				page: pageData,
				meta: metaData,
				theme: themeData,
			} = request.post();

			const page = await PageService.create(request.project, {
				pageData,
				themeData,
				metaData,
				revisionData: {},
				loggedInUser: auth.current.user,
			});

			response.status(201).json({
				message: "Page created",
				data: page,
			});
		} catch (error) {
			Logger.error("Page create failed", error);
			response.status(400).json({
				status: "error",
				message: "Error creating page data",
			});
		}
	}

	async duplicate({ request, params, response, auth }) {
		try {
			const { slug, title } = request.post();

			let page = await request.project
				.pages()
				.where("uuid", params.pageid)
				.with("revisions", (builder) => {
					builder.where("head", true);
				})
				.fetch();

			page = page.toJSON()[0];

			const dupPage = await PageService.create(request.project, {
				pageData: {
					slug,
					title,
				},
				themeData: {
					...(page.theme_id && {
						id: page.theme_id,
					}),
				},
				metaData: {
					title,
				},
				revisionData: {
					json_content: page.revisions[0].json_content || "",
				},
				loggedInUser: auth.current.user,
			});

			response.status(201).json({
				message: "Page duplicated",
				data: dupPage,
			});
		} catch (error) {
			Logger.error("Page duplicate failed", error);
			response.status(400).json({
				status: "error",
				message: "Error duplicating page",
			});
		}
	}

	async delete({ request, params, response }) {
		try {
			await PageService.delete(request.project, params.pageid);
			const pages = await PageService.list(request.project, {
				pageNum: 1,
				search: "",
			});
			response.status(200).json({
				message: "Page deleted",
				data: pages,
			});
		} catch (error) {
			Logger.error("Page delete failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not delete page",
			});
		}
	}

	async save({ request, params, response, auth }) {
		try {
			const {
				revision: revisionData,
				meta: metaData,
				publishPage,
				disableNewRevision,
			} = request.post();

			const page = await PageService.update(request.project, {
				pageId: params.pageid,
				revisionData,
				metaData,
				publishPage,
				loggedInUser: auth.current.user,
				options: {
					disableNewRevision: disableNewRevision,
				},
			});

			response.json({
				message: "Page saved",
				data: page,
			});
		} catch (error) {
			Logger.error("Page save failed", error);
			response.status(400).json({
				status: "error",
				message: "Could not save page",
			});
		}
	}

	async revertRevision({ request, response, auth, params }) {
		try {
			const pageUUID = params.pageid;
			const { revisionID } = request.post();
			const loggedInUser = auth.current.user;
			const page = await Page.findBy("uuid", pageUUID);
			let revisions = await page.revisions().fetch();
			revisions = this.sortRevisions(revisions.rows);
			let newHeadIndex = await revisions.findIndex(
				(r) => r.id === revisionID
			);
			if (newHeadIndex > -1) {
				for (let rev of revisions.slice(0, newHeadIndex)) {
					await rev.delete();
				}
				revisions[newHeadIndex].head = true;
				await revisions[newHeadIndex].save();

				await this.logActivity(
					loggedInUser,
					{ action: Constants.page_actions.REVERTED },
					page
				);

				response.status(200).json({
					data: await this.getFormattedPageData(pageUUID),
					message: "Success",
				});
			} else {
				throw new Error("Invalid Revision ID");
			}
		} catch (error) {
			Logger.error("Revision revert failed", error.message);
			response.status(400).json({
				status: "error",
				message: "Error reverting revision",
			});
		}
	}

	async preview({ request, response, params }) {
		try {
			const { version } = request.get();
			const preview = await PageService.getHTML(
				request.project,
				params.pageid,
				version
			);
			response.status(200).send({
				data: preview,
				message: "Success",
			});
		} catch (error) {
			Logger.error("Error getting page HTML", error);
			response.status(400).json({
				status: "error",
				message: `Could not get preview: ${error.message}`,
			});
		}
	}

	async getHTMLContent({ request, response }) {
		try {
			const { slug, projectID } = request.get();
			const project = await Project.find(projectID);
			const page = await project.pages().where("slug", slug).fetch();
			const pageData = await this.getFormattedPageData(page.rows[0].uuid);
			const publishedRevision = pageData.revisions.find(
				(r) => r.published
			);

			response.status(200).json({
				data: {
					meta: pageData.meta,
					context: publishedRevision.json_content.reduce(
						(acc, curr) => acc.concat(curr.context),
						[]
					),
					htmlstr: publishedRevision.json_content.reduce(
						(acc, curr) => acc + curr.htmlstr,
						""
					),
				},
				message: "Success",
			});
		} catch (error) {
			Logger.error("Error getting page HTML", error);
			response.status(400).json({
				status: "error",
				message: "Could not get page HTML",
			});
		}
	}

	async formService({ request, params, response }) {
		try {
			let resData = "";
			switch (params.service) {
				case "validation":
					resData = await PageService.validate(
						request.project,
						request.get()
					);
			}
			response.status(200).json({
				message: "Success",
				data: resData,
			});
		} catch (error) {
			Logger.error("Form service error", error);
			response.status(400).json({
				status: "error",
				message: "Form service error",
			});
		}
	}

	async getFormattedPageData(pageUUID) {
		let result = {};
		const page = await Page.findBy("uuid", pageUUID);
		if (page.deleted) {
			throw new Error("Page is deleted");
		}
		let revisions = await page.revisions().with("author").fetch();
		revisions = revisions.toJSON();
		result = { ...page.toJSON() };
		result.meta = await page.meta().fetch();
		result.theme = await page.theme().fetch();
		if (!result.theme) {
			try {
				let project = await page
					.project()
					.with("setting.theme")
					.fetch();
				project = project.toJSON();
				result.theme = project.setting.theme;
			} catch (e) {
				console.log(e);
			}
		}
		result.revisions = this.sortRevisions(revisions);

		// plugin partials
		for (const revision of result.revisions) {
			for (const index in revision.json_content) {
				const jsonContent = revision.json_content[index];
				if (jsonContent.isPartial && jsonContent.partialID) {
					let partial = await Partial.findBy(
						"uuid",
						jsonContent.partialID
					);
					partial = partial.toJSON();
					revision.json_content[index] = {
						...partial.module,
					};
				}
			}
		}

		return result;
	}

	sortRevisions(revisions) {
		const sorted = [];
		let ptr = revisions.find((r) => r.head);
		do {
			sorted.push(ptr);
			ptr = revisions.find((r) => r.id === ptr.previous_revision);
		} while (ptr);
		return sorted;
	}

	async logActivity(loggedInUser, activityData, page) {
		try {
			const project = await loggedInUser
				.projects()
				.where("project_id", page.project_id)
				.fetch();

			if (!project || !project.rows[0]) {
				throw new Error("Invalid project");
			}

			const activity = await Activity.create(activityData);
			await activity.user().associate(loggedInUser);
			await activity.page().associate(page);
			await activity.project().associate(project.rows[0]);
		} catch (error) {
			Logger.error("Error logging activity", error);
		}
	}
}

module.exports = PageController;
