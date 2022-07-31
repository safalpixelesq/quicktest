## Style config reference

An optional style object can be included to customize the attributes of a given module. Common settings are available across all the modules, in addition to specific ones for certain modules, for granular-level settings.

All the configurations are optional, if no value is provided, the default setting will be used. Sample style object:

```json
{
	"content": [
		{
			"module": "simple-block",
			...
			"style": {
				"bgType": "color",
				"bgValue": "#000000",
				"vPadding": "10",
				"container": true,
				"align": "left",
				"dark": true
			}
		}
	]
}
```

### Common style settings available across all modules

#### bgType _(String)_

bg is short for background. Choose from: image, color and gradient. The text color on the modules is automatically swapped to provide the best contrast.

#### bgValue _(String)_

For the type of background you choose in "bgType" option. For
image: URL of the image (use CDN for optimum performance).
color: Hex or rgba, for tailwind based projects, all the tailwind colors are supported by their class names.
gradient: Use any CSS gradient

#### vPadding _(String)_

For vertical spacing/padding on modules. Choose from: **xs**, **sm**, **md**, **base**, **lg**, **xl** and **none**.

#### container _(Boolean)_

To set a maximum width for breakpoints, when set to false, the module is stretched to available width.

#### align _(String)_

Align not just text, but also the buttons/links/description, or anything else that can be aligned! Choose from: left, right and center

#### dark _(Boolean)_

Optional configuration to override the default text color on the module, for darker images. Force the text to have right contrast by setting this to true

### Common style config

Following are the custom style configs available for certain modules:

Modules with Image:

#### mediaPos _(String)_

Define the placement of the image relative to the text. Choose from: left, right, top and bottom

#### mediaWidth

Can't find an image that fits the availabe space? Just configure the image width to auto-balance the space for text around it. Choose from the following ratios: 1/5, 1/4, 1/3, 2/5, 1/2, 3/5, 2/3, 3/4, 4/5

<br/>
<br/>
Modules with collections

#### columns _(Integer)_

Pick the number of columns for collection items. Choose from: 1, 2, 3, 4, 5 and auto. Auto to be used when the columns count is dynamic based on the number of items

#### columnGap _(String)_

Control the space between items/columns in grid collection. Choose from: sm, md, lg and none

#### itemBgType _(String)_

Similar to bgType, this setting is applied to every item on the grid. Please note that it may not be applicable in every case, and depends upon the choice of module.

#### itemBgValue _(String)_

For the type of background you choose in "bgType" option. For
image: URL of the image (use CDN for optimum performance).
color: Hex or rgba, for tailwind based projects, all the tailwind colors are supported by their class names.
gradient: Use any CSS gradient

#### itemAlign _(String)_

Note that this configuration is for every item in the collection! Choose from: left, right and center

<br/>
<br/>
<br/>
