const { ServiceProvider } = require("@adonisjs/fold");

class HostProvider extends ServiceProvider {
	register() {
		this.app.singleton("Host", () => {
			return new (require("."))();
		});
	}
}

module.exports = HostProvider;
