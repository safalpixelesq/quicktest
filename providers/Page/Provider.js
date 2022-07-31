const { ServiceProvider } = require("@adonisjs/fold");

class PageProvider extends ServiceProvider {
	register() {
		this.app.singleton("Page", () => {
			return new (require("."))();
		});
	}
}

module.exports = PageProvider;
