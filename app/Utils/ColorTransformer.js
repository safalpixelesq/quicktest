const Color = require("color");

class ColorTransformer {
	static lighten(inputColor, percentage) {
		try {
			if (!inputColor || !percentage) {
				return "";
			}
			return Color(inputColor).lighten(percentage).hex();
		} catch (error) {
			console.log(error);
			return "";
		}
	}

	static darken(inputColor, percentage) {
		try {
			if (!inputColor || !percentage) {
				return "";
			}
			return Color(inputColor).darken(percentage).hex();
		} catch (error) {
			console.log(error);
			return "";
		}
	}
}

module.exports = ColorTransformer;
