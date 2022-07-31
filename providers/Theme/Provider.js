const { ServiceProvider } = require("@adonisjs/fold");

class ThemeProvider extends ServiceProvider {
	register() {
		this.app.singleton("Theme", () => {
			return new (require("."))();
		});
	}
}

module.exports = ThemeProvider;
