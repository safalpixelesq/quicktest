const _ = require("lodash");
const nunjucks = require("@frctl/nunjucks")({
	env: {
		trimBlocks: true,
		lstripBlocks: true,
	},
	filters: {
		// filter-name: function filterFunc(){}
		setAttribute: function (obj, key, val) {
			obj[key] = val;
			return obj;
		},

		// Overwrite defaults from template to set style configurations
		setDefaults: function (obj, defaults) {
			const style = obj || {};
			for (let key in defaults) {
				style[key] = style[key] ? style[key] : defaults[key];
			}
			return style;
		},

		// Still need this?
		isMixedBg: function (background) {
			const refArray = ["primary", "secondary", "muted-dark", "image"];
			return _.includes(refArray, background);
		},

		// Set styles for sections, paddings
		setSection: function (style, type, cls) {
			const addClasses = cls || "";
			// Handle backgrounds
			// console.time("ifTime");
			// const bg = style ? style.background : null;
			const { background: bg, spacing, invert } = style || {};
			let bgClassList = "";
			let styleTagList = "";
			if (bg && (bg.includes("#") || bg.includes("rgb"))) {
				const isDarkBg = isDark(bg) ? "uk-light" : "uk-dark";
				bgClassList = `${isDarkBg} ${addClasses}`;
				styleTagList = `background:${bg};`;
			} else if (bg && bg.includes(".")) {
				bgClassList = `uk-background-cover ${
					invert ? "uk-dark" : "uk-light"
				} ${addClasses}`;
				styleTagList = `background-image:${bg};`;
			} else {
				bgClassList = `${
					invert ? "uk-dark" : "uk-light"
				} ${addClasses}`;
				styleTagList = `background:${bg};`;
			}
			// console.timeEnd("ifTime");

			// Handle Spacings
			// Options: xs, sm, md, lg, xl, xs-t, xs-b, sm-t, sm-b, md-t, md-b, lg-t, lg-b, xl-t, xl-b

			const spacingConfig = {
				xs: "uk-section-xsmall",
				"xs-t": "uk-section-xsmall uk-padding-remove-bottom",
				"xs-b": "uk-section-xsmall uk-padding-remove-top",
				sm: "uk-section-small",
				"sm-t": "uk-section-small uk-padding-remove-bottom",
				"sm-b": "uk-section-small uk-padding-remove-top",
				md: "uk-section",
				"md-t": "uk-section uk-padding-remove-bottom",
				"md-b": "uk-section uk-padding-remove-top",
				lg: "uk-section-large",
				"lg-t": "uk-section-large uk-padding-remove-bottom",
				"lg-b": "uk-section-large uk-padding-remove-top",
				xl: "uk-section-xlarge",
				"xl-t": "uk-section-xlarge uk-padding-remove-bottom",
				"xl-b": "uk-section-xlarge uk-padding-remove-top",
				none: "uk-padding-remove-vertical",
			};

			bgClassList = bgClassList + spacingConfig[spacing];

			// console.log("asdfasd", bgClassList, style.spacing);

			const flstr = `${type === "class" ? bgClassList : styleTagList}`;
			return flstr;
		},

		setContainer: function (style) {
			const { container = "md" } = style || {};
			const containerConfig = {
				xs: "uk-container uk-container-xsmall",
				sm: "uk-container uk-container-small",
				md: "uk-container",
				lg: "uk-container uk-container-large",
				xl: "uk-container uk-container-xlarge",
				ex: "uk-container uk-container-expand",
			};

			const classList = `${containerConfig[container]}`;
			return classList;
		},

		// To handle image/media placement
		setMediaContainer: function (style, isItem) {
			let {
				align,
				justify,
				mediaPos,
				itemMediaPos,
				item = {},
			} = style || {};

			if (isItem) {
				mediaPos = item.mediaPos ? item.mediaPos : itemMediaPos;
			}
			const mediaConfig = {
				right: `uk-flex uk-flex-middle justify-${justify}`,
				left: `uk-flex uk-flex-middle uk-flex-row-reverse`,
				// top: `uk-flex  uk-width-1-1 uk-flex-${justify} uk-flex-column`,
				// bottom: `uk-flex uk-flex-column uk-text-${align} uk-flex-${justify}`
			};
			const classList = `${mediaConfig[mediaPos]}`;
			return classList;
		},

		setGrid: function (style, media, isItem) {
			let {
				align,
				justify,
				mediaWidth,
				mediaPos,
				itemMediaPos,
				itemMediaWidth,
				item = {},
			} = style || {};

			if (isItem) {
				mediaWidth = item.mediaWidth ? item.mediaWidth : itemMediaWidth;
			}

			let widthVals = mediaWidth.split("/");
			widthVals[0] = widthVals[1] - widthVals[0];
			let widthClass = `uk-width-${
				media ? mediaWidth.split("/").join("-") : widthVals.join("-")
			}@s`;
			if (mediaPos === "top" || mediaPos === "bottom") {
				widthClass = `uk-width-${
					media
						? mediaWidth.split("/").join("-")
						: widthVals.join("-")
				}@s`;
			}
			const classList = `${widthClass} uk-text-${align}`;
			return classList;
		},

		// counterWidth: function (currentWidth) {
		// 	let widParams = currentWidth.split("/");
		// 	widParams[0] = widParams[1] - widParams[0];
		// 	return widParams.join("-");
		// },

		// setGridWidth: function (width) {
		// 	let newWidth = width.split("/");
		// 	return newWidth.join("-");
		// },

		// retire
		checkBg: function (style) {
			let bgClassList = "";
			function isDark(color) {
				var r, g, b, hsp;
				if (color.match(/^rgb/)) {
					color = color.match(
						/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
					);
					r = color[1];
					g = color[2];
					b = color[3];
				} else {
					color = +(
						"0x" +
						color.slice(1).replace(color.length < 5 && /./g, "$&$&")
					);
					r = color >> 16;
					g = (color >> 8) & 255;
					b = color & 255;
				}
				hsp = Math.sqrt(
					0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
				);
				// If HSP is more than 127 its considered light
				return hsp < 150;
			}
			if (style.bgType === "color" && style.bgValue.includes("-")) {
				bgClassList =
					style.bgValue.split("-")[1] > 300
						? `bg-${style.bgValue} dark`
						: `bg-${style.bgValue}`;
			} else if (
				(style.bgType === "color" && style.bgValue.includes("#")) ||
				(style.bgType === "color" && style.bgValue.includes("rgb"))
			) {
				bgClassList = isDark(style.bgValue) ? "uk-light" : "";
			} else if (
				style.bgType === "image" ||
				style.bgType === "gradient"
			) {
				bgClassList = style.dark
					? "uk-background-cover uk-light"
					: "uk-background-cover";
			}
			let paddingClassList = "uk-section ";
			switch (style.vPadding) {
				case "xs":
					paddingClassList = " uk-section-xsmall";
					break;
				case "sm":
					paddingClassList = " uk-section-small";
					break;
				case "lg":
					paddingClassList = " uk-section-large";
					break;
				case "xl":
					paddingClassList = " uk-section-xlarge";
					break;
				case "none":
					paddingClassList = " uk-padding-remove-vertical";
					break;
				default:
					break;
			}
			bgClassList = `uk-section ${bgClassList} ${paddingClassList}`;
			return bgClassList;
		},
		// retire
		bgStyle: function (style) {
			let bgStyleStr = "";
			if (
				(style.bgType === "color" && style.bgValue.includes("#")) ||
				(style.bgType === "color" && style.bgValue.includes("rgb"))
			) {
				bgStyleStr = `background-color:${style.bgValue}`;
			} else if (style.bgType === "image") {
				bgStyleStr = `background-image:url(${style.bgValue})`;
			} else if (style.bgType === "gradient") {
				bgStyleStr = `background-image:${style.bgValue}`;
			}
			return bgStyleStr;
		},

		// Insert columns related classes for grid based components
		setColumns: function (style) {
			const { columns, columnGap } = style;
			let columnClass = "";
			if (Number.isInteger(columns)) {
				columnClass = `uk-child-width-1-${columns}@m ${
					columns >= 3 ? `uk-child-width-1-2@s` : ``
				}`;
			} else {
				columnClass = `uk-child-width-expand@m`;
			}

			let columnGapClass = "";
			switch (columnGap) {
				case "sm":
					columnGapClass = `uk-grid-small`;
					break;
				case "md":
					columnGapClass = `uk-grid-medium`;
					break;
				case "lg":
					columnGapClass = `uk-grid-large`;
					break;
				case "no":
					columnGapClass = `uk-grid-collapse`;
					break;
				default:
					columnGapClass = ``;
					break;
			}

			return `${columnClass} ${columnGapClass}`;
		},

		// Set styles for each item (background,align)
		setItem: function (style, type, cls) {
			const addClasses = cls || "";
			// Handle backgrounds
			const {
				itemBackground,
				itemAlign,
				itemJustify,
				itemInvert,
				item = {},
			} = style || {};
			const bg = item.background ? item.background : itemBackground;
			const align = item.align ? item.align : itemAlign;
			const justify = item.justify ? item.justify : itemJustify;
			const invert = item.invert ? item.invert : itemInvert;
			// console.log("itemBackground", itemBackground);
			// console.log("item", item, bg);
			let bgClassList = "";
			let styleTagStr = "";
			if (
				bg &&
				((bg.includes("#") && !bg.includes("gradient")) ||
					bg.includes("rgb"))
			) {
				const isDarkBg = isDark(bg) ? "uk-light" : "uk-dark";
				bgClassList = `${isDarkBg} ${addClasses}`;
				styleTagStr = `background:${bg};`;
			} else if (bg && bg.includes(".")) {
				bgClassList = `uk-background-cover ${
					invert ? "uk-dark" : "uk-light"
				} ${addClasses}`;
				styleTagStr = `background-image:${bg};`;
			} else if (bg && bg.includes("%")) {
				bgClassList = `uk-dark ${addClasses}`;
				styleTagStr = `background:${bg};`;
			} else {
				bgClassList = `${
					invert ? "uk-dark" : "uk-light"
				} ${addClasses}`;
				styleTagStr = `background:${bg};`;
			}

			bgClassList = `uk-text-${align} uk-flex-${justify} ${bgClassList}`;
			// console.log("asdfasd", bgClassList, style.spacing);

			const flstr = `${type === "class" ? bgClassList : styleTagStr}`;
			return flstr;
		},

		setIconPos: function (style) {
			const {
				itemIconPos,
				itemAlign,
				itemJustify,
				item = {},
			} = style || {};
			const iconPos = item.iconPos ? item.iconPos : itemIconPos;
			const align = item.align ? item.align : itemAlign;
			const justify = item.justify ? item.justify : itemJustify;
			const iconPosConfig = {
				left: `uk-flex uk-flex-${justify}`,
				right: `uk-flex uk-flex-${justify} uk-flex-row-reverse`,
				top: `uk-flex uk-flex-${justify} uk-flex-column`,
				bottom: `uk-flex uk-flex-column-reverse uk-flex-${justify}`,
			};
			const classList = `${iconPosConfig[iconPos]}`;
			return classList;
		},

		setIcon: function (style, type, cls) {
			const addClasses = cls || "";
			const {
				itemAlign,
				itemJustify,
				itemIconPos,
				itemIconBackground,
				itemIconShape,
				itemIconSize,
				itemIconColor,
				item = {},
			} = style || {};

			const iconbg = item.iconBackground
				? item.iconBackground
				: itemIconBackground;
			const iconPos = item.iconPos ? item.iconPos : itemIconPos;
			const iconShape = item.iconShape ? item.iconShape : itemIconShape;
			const iconSize = item.iconSize ? item.iconSize : itemIconSize;
			const iconColor = item.iconColor ? item.iconColor : itemIconColor;
			// const align = item.align ? item.align : itemAlign;
			// const justify = item.justify ? item.justify : itemJustify;

			let bgClassList = "";
			let styleTagStr = "";

			if (
				iconbg &&
				(iconbg.includes("#") || iconbg.includes("rgb")) &&
				iconShape !== "none"
			) {
				const isDarkBg = isDark(iconbg) ? "color:#fff;" : "color:#000;";
				bgClassList = `${addClasses}`;
				styleTagStr = `background:${iconbg};${isDarkBg}`;
			} else {
				bgClassList = `${addClasses}`;
				styleTagStr =
					iconShape !== "none" ? `background:${iconbg};` : "";
			}

			// Handle Icon positions
			const iconPosConfig = {
				left: "uk-margin-right",
				right: "uk-margin-left",
				top: "uk-margin-bottom",
				bottom: "uk-margin-top",
			};

			bgClassList = bgClassList + " " + iconPosConfig[iconPos];

			// Handle Icon Shape
			const iconShapeConfig = {
				square: "",
				rounded: "uk-border-rounded",
				circle: "uk-border-circle",
			};

			bgClassList = bgClassList + " " + iconShapeConfig[iconShape];

			// Handle Icon sizes
			const iconSizeConfig = {
				xs: 36,
				sm: 48,
				md: 64,
				lg: 72,
				xl: 96,
				xxl: 128,
			};

			const iconColorStyle = iconColor ? `color:${iconColor};` : "";

			styleTagStr =
				styleTagStr +
				`${
					iconShape !== "none"
						? `padding:8px;box-sizing:border-box;`
						: ``
				};width:${iconSizeConfig[iconSize]}px;height:${
					iconSizeConfig[iconSize]
				}px;${iconColorStyle}`;

			if (addClasses === "abs") {
				const iconPosAbsConfig = {
					top: `top:-${iconSizeConfig[iconSize] / 2}px;`,
					left: `left:-${iconSizeConfig[iconSize] / 2}px;`,
				};

				styleTagStr = styleTagStr + iconPosAbsConfig[iconPos];
			}

			const flstr = `${type === "class" ? bgClassList : styleTagStr}`;
			return flstr;
		},

		// Handle max height for slideshow
		setMaxHeight: function (style) {
			const { spacing } = style;

			const spacingConfig = {
				xs: "250",
				sm: "300",
				md: "400",
				lg: "500",
				xl: "700",
				none: "200",
			};

			return `${spacingConfig[spacing]}`;
		},

		// Insert card bg styles
		getCardStyles: function (style) {
			const hasItemStyles = style.item
				? style.item.bgType
					? true
					: false
				: false;
			const hasParentStyles = style.itemBgType ? true : false;
			const hasDarkStyle = style.item
				? style.item.dark
					? style.item.dark
					: false
				: false;

			let bgType = hasItemStyles
				? style.item.bgType
				: hasParentStyles
				? style.itemBgType
				: style.bgType;
			let bgValue = hasItemStyles
				? style.item.bgValue
				: hasParentStyles
				? style.itemBgValue
				: style.bgValue;
			// let dark = hasItemStyles ? style.item.dark : hasParentStyles ? style.itemBgValue : style.bgValue;

			let bgClassList = "";
			function isDark(color) {
				var r, g, b, hsp;
				if (color.match(/^rgb/)) {
					color = color.match(
						/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
					);
					r = color[1];
					g = color[2];
					b = color[3];
				} else {
					color = +(
						"0x" +
						color.slice(1).replace(color.length < 5 && /./g, "$&$&")
					);
					r = color >> 16;
					g = (color >> 8) & 255;
					b = color & 255;
				}
				hsp = Math.sqrt(
					0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
				);
				// If HSP is more than 127 its considered light
				return hsp < 150;
			}
			if (
				(bgType === "color" && bgValue.includes("#")) ||
				(bgType === "color" && bgValue.includes("rgb"))
			) {
				bgClassList = isDark(bgValue) ? "uk-light" : "uk-dark";
			} else if (bgType === "image" || bgType === "gradient") {
				bgClassList = hasDarkStyle
					? "uk-background-cover uk-light"
					: "uk-background-cover uk-dark";
			}
			return bgClassList;
		},

		getCardBgStyles: function (style) {
			const hasItemStyles = style.item
				? style.item.bgType
					? true
					: false
				: false;
			const hasParentStyles = style.itemBgType ? true : false;
			const hasDarkStyle = style.item
				? style.item.dark
					? style.item.dark
					: false
				: false;

			let bgType = hasItemStyles
				? style.item.bgType
				: hasParentStyles
				? style.itemBgType
				: style.bgType;
			let bgValue = hasItemStyles
				? style.item.bgValue
				: hasParentStyles
				? style.itemBgValue
				: style.bgValue;

			let bgStyleStr = "";
			if (
				(bgType === "color" && bgValue.includes("#")) ||
				(bgType === "color" && bgValue.includes("rgb"))
			) {
				bgStyleStr = `background-color:${bgValue}`;
			} else if (bgType === "image") {
				bgStyleStr = `background-image:url(${bgValue})`;
			} else if (bgType === "gradient") {
				bgStyleStr = `background-image:${bgValue}`;
			}
			return bgStyleStr;
		},
	},
	globals: {
		NODE_ENV: process.env.NODE_ENV,
	},
	extensions: {
		// extension-name: function extensionFunc(){}
	},
});
exports.nunjucks = nunjucks;

function isDark(color) {
	var r, g, b, hsp;
	if (color.match(/^rgb/)) {
		color = color.match(
			/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
		);
		r = color[1];
		g = color[2];
		b = color[3];
	} else {
		color = +(
			"0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
		);
		r = color >> 16;
		g = (color >> 8) & 255;
		b = color & 255;
	}
	hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
	// If HSP is more than 127 its considered light
	return hsp < 150;
}
