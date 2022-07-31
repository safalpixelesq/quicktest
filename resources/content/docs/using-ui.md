## Quick start <span class="text-primary">using UI</span>

Let's start from scratch. We will build the UI of a landing page with Pixelesq modules.

### 1. Add Wrapper

Before jumping to the modules, let's use your favorite code editor and create a new file called index.html. Add the following code to wrap the modules and link assets from our CDN.

```html {index.html}
<!DOCTYPE html>
<html lang="en-us">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<title>Page Title</title>
		<meta name="description" content="Page description goes here" />
		<link rel="shortcut icon" href="/favicon.ico" />
		<link
			rel="stylesheet"
			href="https://assets.uiaas.io/tailwind/default/app.css"
		/>
	</head>
	<body>
		<!-- Modules will go here -->
		<script
			type="text/javascript"
			src="https://assets.uiaas.io/tailwind/default/app.js"
		></script>
	</body>
</html>
```

<br/>

### 2. Customize and Add Modules

Let's add some modules, head over to [Modules](https://staging.pixelesq.com/modules) page and select the module you want to add, head over to the customize page. eg: [Page Hero](https://staging.pixelesq.com/modules/image-block--default)

Here you can customize the module with multiple configurations available. For more details on configurations, read our [docs](https://staging.pixelesq.com/modules)

<!-- ![Page Hero](https://assets.uiaas.io/web/page-hero.webp) -->

<!-- Once you navigate to the customize screen of that [module](https://staging.pixelesq.com/modules/simple-block--as-hero) -->

![Customize Page hero module](../../media/screenshots/modules-customize.webp)

Once you have configured the module to your liking, use the "COPY" button to get the markup and place it in the wrapper file.

<br/>

### 3. Go live

Now that you have a a full html file, you should be already able to preview it on your browser, but what fun is it if you don't make it available for everyone?

Since the output is HTML file, it can be hosted with any service! The simplest being [Netlify](https://app.netlify.com/drop), where you can just drop this html and you can go live!

![Customize Page hero module](../../media/screenshots/netlify-drop.webp)

<br/>
<br/>
<br/>
