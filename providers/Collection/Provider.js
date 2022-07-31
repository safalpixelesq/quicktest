const { ServiceProvider } = require("@adonisjs/fold");

class CollectionProvider extends ServiceProvider {
	register() {
		this.app.singleton("Collection", () => {
			return new (require("."))();
		});
	}
}

module.exports = CollectionProvider;
