## Quick start <span class="text-primary">using API</span>

Let's start from scratch and lets build a landing page. We will build out the UI for a page using Pixelesq modules

### 1. Generate Personal Token

To authenticate to and access Pixelesq REST APIs, you start with generating personal access token here [Dashboard](/dashboard).

The token should be sent as an Auth header as shown:

```bash
curl -X GET -H 'Authorization: Bearer <personal-access-token>' \
	 https://api.uiaas.io/gethtml
```

<br/>

### 2. Customize and Add Modules

Let's add some modules, head over to [Modules](https://staging.pixelesq.com/modules) page and selct the module you want to add, head over to the customize page. eg: [Page Hero](https://staging.pixelesq.com/modules/image-block--default)

Here you can customize the module with multiple configurations available. For more details on configurations, read our [docs](https://staging.pixelesq.com/modules)

<!-- ![Page Hero](https://assets.uiaas.io/web/page-hero.webp) -->

<!-- Once you navigate to the customize screen of that [module](https://staging.pixelesq.com/modules/simple-block--as-hero) -->

![Customize Page hero module](../../media/screenshots/modules-customize.webp)

Once you have configured to module to your liking, use the "COPY" button to get the markup and place in the wrapper file.

<br/>

### 3. Go live

Now that you have a a full html file, you should be already able to preview it on your browser, but what fun is it if we don't make it available for everyone!

Since the output is HTML file, it can be hosted with any service! The simplest being [Netlify](https://app.netlify.com/drop), where you can just drop this html and you can go live!

![Customize Page hero module](../../media/screenshots/netlify-drop.webp)

<br/>
<br/>
<br/>
