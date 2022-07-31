"use strict";

const Env = use("Env");
const View = use("View");
const Host = use("Host");
const Logger = use("Logger");
const Fractal = use("Fractal");
const Constants = use("App/Utils/Constants");
const ThemeModel = use("App/Models/Theme");
const PartialModel = use("App/Models/Partial");

class Page {
	/**
	 * Get a page in a project
	 */
	async get(project, pageId) {
		let page = await project
			.pages()
			.where("uuid", pageId)
			.where("deleted", false)
			.fetch();

		return this.getFormattedPageData(page.rows[0], project);
	}

	/**
	 * Get a list of pages in a project
	 */
	async list(project, payload) {
		const pages = await project
			.pages()
			.where("deleted", false)
			.where((builder) => {
				builder.where("slug", "LIKE", `%${payload.search}%`);
				builder.orWhere("title", "LIKE", `%${payload.search}%`);
			})
			.with("author")
			.with("meta")
			.with("entry.collection")
			.orderBy("updated_at", "desc")
			.paginate(payload.pageNum);

		return pages;
	}

	/**
	 * Create a pages in a project
	 */
	async create(
		project,
		{ pageData, metaData, themeData, revisionData, loggedInUser }
	) {
		const existingPage = await project
			.pages()
			.where("deleted", false)
			.where("slug", pageData.slug)
			.fetch();

		if (existingPage.rows[0]) {
			throw new Error("Duplicate slug found");
		}

		const page = await project.pages().create(pageData);
		await page.meta().create(metaData);

		await page.author().associate(loggedInUser);

		if (themeData && themeData.id) {
			const theme = await ThemeModel.find(themeData.id);
			await page.theme().associate(theme);
		}

		// create default revision
		const revision = await page.revisions().create(revisionData);
		await revision.author().associate(loggedInUser);

		return page;
	}

	/**
	 * Update a pages in a project
	 */
	async update(
		project,
		{
			pageId,
			metaData,
			revisionData,
			publishPage,
			loggedInUser,
			options = {},
		}
	) {
		let page = await project.pages().where("uuid", pageId).fetch();
		page = page.rows[0];

		let revision = options.disableNewRevision
			? await page.revisions().where("head", true).fetch()
			: await page
					.revisions()
					.where("head", true)
					.where("locked", false)
					.fetch();
		revision = revision.rows[0];
		if (revisionData) {
			if (revision) {
				revision.json_content = revisionData.json_content;
				await revision.save();
				Logger.info(
					`Revision ${revision.id} for page ${page.id} updated`
				);
			} else {
				revision = await page.revisions().create(revisionData);
				Logger.info(
					`Revision ${revision.id} for page ${page.id} created`
				);
			}
		}

		if (publishPage) {
			let setting = await project.setting().with("integration").fetch();
			setting = setting.toJSON();
			await page.revisions().update({ published: false });
			revision.locked = 1;
			revision.published = true;
			await revision.save();

			if (setting.integration) {
				await Host.publish(
					[
						{
							model: page.toJSON(),
							html: await this.getHTML(page),
						},
					],
					setting.integration
				);
			}

			await this.logActivity(
				project,
				loggedInUser,
				{
					action: Constants.page_actions.PUBLISHED,
				},
				page
			);
		} else {
			await this.logActivity(
				project,
				loggedInUser,
				{ action: Constants.page_actions.SAVED },
				page
			);
		}

		if (metaData) {
			if (metaData.slug && metaData.slug !== page.slug) {
				const existingPage = await project
					.pages()
					.where("slug", metaData.slug)
					.where("deleted", false)
					.fetch();

				if (existingPage.rows[0]) {
					throw new Error("Duplicate slug found");
				} else {
					page.slug = metaData.slug;
				}
			}

			page.title = metaData.title || page.title;
			delete metaData.slug;
			await page.meta().update(metaData);
		}

		// update page on revision update

		page.updated_at = Date.now();
		await page.save();

		return this.getFormattedPageData(page, project);
	}

	/**
	 * Delete a page from project
	 */
	async delete(project, pageId) {
		let setting = await project.setting().with("integration").fetch();
		setting = setting.toJSON();
		let page = await project.pages().where("uuid", pageId).fetch();
		page = page.rows[0];
		if (setting.integration) {
			await Host.delete(
				[
					{
						model: page.toJSON(),
						html: await this.getHTML(page),
					},
				],
				setting.integration
			);
		}

		page.deleted = true;
		await page.save();

		return page;
	}

	/**
	 * Validate a page field
	 */

	async validate(project, payload = {}) {
		if (payload.type === "unique-slug") {
			const count = await project
				.pages()
				.where("slug", payload.value)
				.where("deleted", false)
				.getCount();
			return count === 0;
		}

		return false;
	}

	/**
	 * Get page HTML
	 */

	async getHTML(project, pageId, version) {
		const projectJSON = project.toJSON();
		const page = await project.pages().where("uuid", pageId).fetch();
		const pageData = await this.getFormattedPageData(page.rows[0], project);
		const previewRevision =
			version === "draft"
				? pageData.revisions.find((r) => r.head)
				: pageData.revisions.find((r) => r.published);

		if (!previewRevision) {
			throw new Error("No revision found");
		}

		const uikitFractal = Fractal.getFractalInstance("uikit");
		for (const content of previewRevision.json_content) {
			if (!content.htmlstr) {
				content.htmlstr = await Fractal.getRender(uikitFractal, [
					content.context,
				]);
			}
		}
		return View.render("base-page", {
			slugId: projectJSON.slugId,
			spacesUrl: Env.get("SPACES_URL"),
			cssPath: await this.pageCSS(page.rows[0], projectJSON.slugId),
			htmlStr: previewRevision.json_content.reduce(
				(acc, curr) => acc + curr.htmlstr,
				""
			),
		});
	}

	async getFormattedPageData(page, project) {
		const result = { ...page.toJSON() };
		const projectJSON = project.toJSON();
		let revisions = await page.revisions().with("author").fetch();
		revisions = revisions.toJSON();
		result.meta = await page.meta().fetch();
		result.theme = await page.theme().fetch();
		result.cssPath = `${Env.get("SPACES_URL")}/${await this.pageCSS(
			page,
			projectJSON.slugId
		)}`;
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
			if (revision && revision.json_content) {
				for (const index in revision.json_content) {
					const jsonContent = revision.json_content[index];
					if (jsonContent.isPartial && jsonContent.partialID) {
						let partial = await PartialModel.findBy(
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

	async logActivity(project, loggedInUser, activityData, page) {
		try {
			const activity = await project.activities().create(activityData);
			await activity.user().associate(loggedInUser);
			await activity.page().associate(page);
		} catch (error) {
			Logger.error("Error logging activity", error);
		}
	}

	async pageCSS(page, slugId) {
		const pageTheme = await page.theme().fetch();
		const cssPath = `theme/${Env.get("NODE_ENV")}/${slugId}/${
			pageTheme ? pageTheme.name : "app"
		}.css`;

		return cssPath;
	}

	async republisPagesWithPartial(project, partialId) {
		const publishList = [];
		let setting = await project.setting().with("integration").fetch();
		setting = setting.toJSON();

		if (setting.integration) {
			const pages = await project
				.pages()
				.where("deleted", false)
				.with("revisions", (builder) => {
					builder
						.where("published", true)
						.andWhere("json_content", "like", `%${partialId}%`);
				})
				.fetch();
			const pagesJSON = pages.toJSON();
			for (const index in pagesJSON) {
				if (pagesJSON[index].revisions.length > 0) {
					publishList.push({
						model: pagesJSON[index],
						html: await this.getHTML(pages.rows[index]),
					});
				}
			}

			await Host.publish(publishList, setting.integration);
		}
	}
}

module.exports = Page;
