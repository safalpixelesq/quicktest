const Env = use("Env");

module.exports = {
	cloudinary: {
		cloud_name: Env.get("CLOUDINARY_CLOUD_NAME"),
		api_key: Env.get("CLOUDINARY_API_KEY"),
		api_secret: Env.get("CLOUDINARY_API_SECRET"),
		secure: true,
	},
};
