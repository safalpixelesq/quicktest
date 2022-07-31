const { ServiceProvider } = require("@adonisjs/fold");

class FractalProvider extends ServiceProvider {
	register() {
		this.app.singleton("Fractal", () => {
			return new (require("."))();
		});
	}
}

module.exports = FractalProvider;
