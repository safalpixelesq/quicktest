"use strict";

const Logger = use("Logger");
const Activity = use("App/Models/Activity");

class ActivityController {
	async list({ request, response }) {
		try {
			const { projectID } = request.get();
			let activities = await Activity.query()
				.where("project_id", projectID)
				.orderBy("created_at", "desc")
				.with("user")
				.with("page.meta")
				.limit(10)
				.fetch();

			response.status(200).json({
				data: activities,
				message: "Success",
			});
		} catch (error) {
			Logger.error("Error logging activity", error);
			response.status(500).json({ message: "Error logging activity" });
		}
	}

	async log({ request, response, auth }) {
		// try {
		// 	const { activity: activityData, projectID } = request.post();
		// 	const loggedInUser = auth.user;
		// 	const project = await loggedInUser
		// 		.projects()
		// 		.where("project_id", projectID)
		// 		.fetch();
		// 	if (!project || !project.rows[0]) {
		// 		throw new Error("Invalid project");
		// 	}
		// 	const activity = await Activity.create(activityData);
		// 	await activity.user().associate(loggedInUser);
		// 	await activity.project().associate(project.rows[0]);
		// 	response.status(200).json({
		// 		message: "Success",
		// 	});
		// } catch (error) {
		// 	Logger.error("Error logging activity", error);
		// 	response.status(500).json({ message: "Error logging activity" });
		// }
	}
}

module.exports = ActivityController;
