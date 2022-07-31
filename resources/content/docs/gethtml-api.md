## gethtml API

Before you can use this API, you need to obtain Personal Access token:

### Generate Personal Token

[Sign up](https://pixelesq.com/signup) for free and access your [Dashboard](https://pixelesq.com/dashboard). Click on Generate and copy the token and treat it as a secret.

The token should be sent as an Auth header as shown:

```bash
curl -X GET -H 'Authorization: Bearer <personal-access-token>' \
	 https://api.uiaas.io/gethtml
```

<br/>

### Request URL & POST data

To get html/ui/markup for modules/pages, this is the only api you need:

```markup
https://api.uiaas.io/gethtml
```

A request object must have at least one content array with a minimum of one module :

```json
{
	"content": [
		{
			"module": "simple-block",
			"title": "Title goes here",
			"description": "Description goes here",
			"style": {
				"bgType": "color",
				"bgValue": "#efefef",
				"align": "left"
			}
		}
	]
}
```

An optional 'meta' object can be included to set various configurations and SEO meta tags when used in 'page' mode, like so:

```json
{
	"meta": {
		"apimode": "page",
		"title": "Meta title",
		"description":"Meta/og description"
	},
	content:[
		{
			...
		}
	]
}
```

<br/>

### API Modes

gethtml API can be used to recieve markup in two modes, which can be set via meta object in the request data.

#### Page

```json
apimode:page
```

Generates a full html page with links to stylesheets, scripts included, with SEO tags and meta tags for social sharing. This can be directly previewed on any browser or can be served with any hosting provider, including static site hostings like Netlify and Vercel.

#### Component

```json
apimode:component
```

Use this mode when all you want is markup for modules. It does not add any Doctype or html or body tags. This mode is suited when you are integrating with a Static Site generator like Gatsby or Gridsome. The styles can be found here, [download](https://assets.uiaas.io/tailwind/default/app.css) or link it directly in your html head like this:

```html
<link
	rel="stylesheet"
	href="https://assets.uiaas.io/tailwind/default/app.css"
/>
```

<br/>
<br/>
<br/>
