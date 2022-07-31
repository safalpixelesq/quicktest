const { ServiceProvider } = require("@adonisjs/fold");

class TemplateProvider extends ServiceProvider {
	register() {
		this.app.singleton("Template", () => {
			return new (require("."))();
		});
	}
}

module.exports = TemplateProvider;
