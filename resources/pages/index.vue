<template>
	<div id="homepage" class="">
		<Hero :content="content.hero"></Hero>
		<About :content="content.about"></About>

		<Footer :dark="true"></Footer>
	</div>
</template>

<script>
import Hero from '~/components/page/Hero.vue'
import About from '~/components/page/About.vue'
import Footer from '~/components/Footer.vue'
export default {
	components: {
		Hero,
		About,
		Footer,
	},
	transition: 'default',

	data() {
		return {
			notification: {
				message: '',
				type: '',
			},
			modulesCta: {
				title: 'Browse Library',
				url: '/modules',
				type: 'primary',
				size: 'md',
			},
			content: {
				hero: {
					subtitle: 'UI as a Service',
					title:
						'An innovative API-driven approach to building User Interfaces',
					desc:
						'We offer lego like modules, which are higly customizable, suits any content and look great on every device! Components are platform agnostic, so no matter what you are currently using, we plug in!',
					sites: [
						{
							title: 'Marketing Sites',
							desc: '',
							color: '#FBBF24',
							image:
								'https://assets.uiaas.io/web/templates/marketing.jpg',
						},
						{
							title: 'Campaign Pages',
							desc: '',
							color: '#3B82F6',
							image:
								'https://assets.uiaas.io/web/templates/app.jpg',
						},
						{
							title: 'Landing Pages',
							desc: '',
							color: '#EF4444',
							image:
								'https://assets.uiaas.io/web/templates/product.jpg',
						},
						{
							title: 'Portfolios',
							desc: '',
							color: '#8B5CF6',
							image:
								'https://assets.uiaas.io/web/templates/campaign.jpg',
						},
					],
				},
				about: {
					subtitle: '',
					title:
						"Pixelesq's powerful APIs have everything you need to create beautiful web pages that are scalable, SEO-optimized, performant and look good on any screen size.",
					desc: '',
					image: {
						url: 'https://assets.uiaas.io/web/allmodules-2-bg.webp',
						alt: 'All modules',
					},
					items: [
						{
							title: 'Marketers',
							desc:
								'Quickly iterate over content and layouts to experiment with advertising campaigns, product announcements or A/B tests, to produce effective targeting strategies for promoting products and services.',
							color: 'primary',
							image: {
								url:
									'https://assets.uiaas.io/web/developers.webp',
								alt: 'Code Editor',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
						{
							title: 'Developers',
							desc:
								'A single API call to build an entire web page! Tweak colors, layout, and plug in content from any external source; no HTML/CSS coding skills required!',
							color: 'secondary',
							image: {
								url:
									'https://assets.uiaas.io/web/marketers.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
						{
							title: 'Individuals',
							desc:
								'Whether you are a business owner, content creator, blogger or a job seeker, we have 100s of customizable modules to help you create the online presence that fits your style!',
							color: 'tertiary',
							image: {
								url:
									'https://assets.uiaas.io/web/everyone.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
					],
				},
				resources: {
					subtitle: 'Documentation',
					title: 'Where to head next?',
					desc: '',
					image: {
						url: 'https://assets.uiaas.io/web/allmodules-2-bg.webp',
						alt: 'All modules',
					},
					items: [
						{
							title: 'For Developers',
							desc:
								'Integrate with our powerful APIs to generate parts of, or an entire web page where styles and content are simple key-value pairs. ',
							color: 'primary',
							image: {
								url:
									'https://assets.uiaas.io/web/builder2.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
						{
							title: 'For Marketers',
							desc:
								'Accelerate building digital experiences with our UI builder that lets you drag and drop, and customize style and content in an intuitive visual editor.',
							color: 'secondary',
							image: {
								url:
									'https://assets.uiaas.io/web/builder1.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
						{
							title: 'For Everyone',
							desc:
								'Our tool is for anyone who wants to build a professional website for their business, portfolio or blog!',
							color: 'tertiary',
							image: {
								url:
									'https://assets.uiaas.io/web/builder3.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
					],
				},
				features: {
					title: '',
					desc:
						'Choose from a wide range of lego-like, platform-agnostic web modules and use them as building blocks to assemble parts of a page, a full page or an entire website that can be integrated with any tech-stack',
					items: [
						{
							subtitle: 'Look Amazing',
							title: 'Responsive',
							desc:
								'Adaptable modules that render well on any device, regardless of its size or shape',
							icon: 'template',
						},
						{
							subtitle: 'Be Found',
							title: 'SEO Optimized',
							desc:
								'Rank high on search engines, increase traffic and grow customer-base',
							icon: 'document-search',
						},
						{
							subtitle: 'Ace speedtests',
							title: 'Performant',
							desc:
								"Optimized for Google Core Web Vitals, and PageSpeed insights' best practices",
							icon: 'chart-square-bar',
						},
						{
							subtitle: 'Be You',
							title: 'Customizable',
							desc:
								'Choose from unlimited colors, styles and layout options to build your brand.',
							icon: 'adjustments',
						},
					],
				},
				builder: {
					subtitle: 'UI Builder',
					title: 'Easiest way to get started',
					desc:
						'UI builder is an easy to use tool that lets you assemble, customize styles and content, and preview, all in one interactive visual editor.',
					items: [
						{
							title: 'Drag and Drop',
							desc:
								'We have over 100+ professionally designed, hand-coded and fully responsive web modules grouped into categories like Header, Hero, Features etc. Pick the ones that best fit your needs, drag and drop them into the canvas, and start assembling your page.',
							theme: 'primary',
							image: {
								url:
									'https://assets.uiaas.io/web/builder1.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
						{
							title: 'Customize and Edit',
							desc:
								'Showcase your content in the best way possible. Change colors and layout, throw in some images, adjust alignments, edit content, rearrange the modules and customize until you see your vision come to life.',
							theme: 'secondary',
							image: {
								url:
									'https://assets.uiaas.io/web/builder2.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
						{
							title: 'Export and Publish',
							desc:
								'Once you have the desired page/ui, easily export the stand-alone file or deploy it directly to supported platforms.',
							theme: 'tertiary',
							image: {
								url:
									'https://assets.uiaas.io/web/builder3.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
					],
				},
				uiapi: {
					subtitle: 'UI API',
					title: 'Generate UI from API',
					desc:
						'Already have Backend Systems, or CMS? You can integrate with our API to generate UI or pages. Fastest way to build large sites!',
					items: [
						{
							title: 'Add Modules',
							desc:
								'Choose from more than 100 ready to use modules, categorized into intitutive groups like, headers, hero sections, features.',
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							component: 'Addmod',
						},
						{
							title: 'Layout and Content',
							desc:
								'Customize any layout using tons of configurations which let you tweak the layout to best fit your content! Easily add the content from any external source',
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							component: 'Editmod',
						},
						{
							title: 'Integrate & Deploy',
							desc:
								'Once you have the desired page/ui, easily export the stand-alone file or deploy it directly to supported platforms.',
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							component: 'Exportmod',
						},
					],
					others: [
						{
							title:
								'What if a single API call could build an entire webpage?',
							desc: '',
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							features: [
								`<span class="uk-text-bold">Mode</span>: You can choose to get just the component, or a fully optimized page!`,
								`<span class="uk-text-bold">Analytics</span>: Add GA or any marketing pixel to every page built with ease`,
								`<span class="uk-text-bold">Customize</span>: Each module offers tons of configurations, which can be tweaked while generating in bulk.`,
								`<span class="uk-text-bold">Publish</span>: Add Workflows to directly publish pages to production, whenever content is changed.`,
							],
						},
					],
				},
				explore: {
					subtitle: 'Module Library',
					title: 'Explore the collection',
					desc:
						'Browse through our rich collection of easily customizable modules that are built to meet your business needs; we can’t wait to see what you build next!',
					image: {
						url: 'https://assets.uiaas.io/web/allmodules-2-bg.webp',
						alt: 'All modules',
					},
					items: [
						{
							title: 'Drag and Drop',
							desc:
								'Choose from more than 100 ready to use modules, categorized into intitutive groups like, headers, hero sections, features. Just drag and drop the ones you like from the slection to the page on the right, to start assembling your page.',
							image: {
								url:
									'https://assets.uiaas.io/web/builder1.webp',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
							media: {
								url:
									'https://assets.uiaas.io/web/pqdemo-v1.mp4',
								alt:
									'UI builder: Showing Drag and Drop interaction',
							},
						},
					],
				},
			},
		}
	},
	head() {
		return {
			title: 'Pixelesq | UI as a Service',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content:
						'Pixelesq offers beautiful UI components, which can be directly plugged into your code or can be integrated with API. UI as a Service',
				},
				{
					hid: 'keywords',
					name: 'keywords',
					content:
						'UIaaS, UI as a Service, HTML Components, Tailwind Components',
				},
			],
		}
	},
	computed: {},
	mounted() {},
	methods: {},
}
</script>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
	transition-property: opacity;
	transition-timing-function: ease-in-out;
	transition-duration: 300ms;
}
.page-enter,
.page-leave-to {
	opacity: 0;
}
.hero {
	transition: all 0.5s;
}
</style>
