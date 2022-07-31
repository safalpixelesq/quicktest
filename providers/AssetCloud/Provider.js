const { ServiceProvider } = require("@adonisjs/fold");

class AssetCloudProvider extends ServiceProvider {
	register() {
		this.app.singleton("Asset/Cloud", () => {
			const Config = this.app.use("Adonis/Src/Config");
			return new (require("."))(Config);
		});
	}
}

module.exports = AssetCloudProvider;
