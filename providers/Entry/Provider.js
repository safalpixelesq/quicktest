const { ServiceProvider } = require("@adonisjs/fold");

class EntryProvider extends ServiceProvider {
	register() {
		this.app.singleton("Entry", () => {
			return new (require("."))();
		});
	}
}

module.exports = EntryProvider;
