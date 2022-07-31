<template>
	<div class="font-sans">
		<div class="flex flex-col min-h-screen">
			<Header
				v-if="error.statusCode === 404"
				:dark="true"
				:hero-bg-styles="'background-color:#1a202c'"
			/>
			<div class="dark bg-red-700">
				<div class="py-20">
					<div
						class="container mx-auto px-5 sm:px-6 lg:px-8 text-center"
					>
						<h1
							class="text-2xl font-sans font-bold leading-normal text-gray-200 md:text-4xl"
						>
							{{
								error.statusCode === 404
									? 'Page not found'
									: 'An error Occurred'
							}}
						</h1>
					</div>
				</div>
			</div>
			<div class="container mx-auto px-5 sm:px-6 lg:px-8 flex-grow">
				<div class="flex items-center">
					<div class="w-full md:w-2/5">
						<h2
							v-if="error.statusCode === 404"
							class="py-20 text-xl md:text-2xl font-normal relative z-10"
						>
							This link is either broken or the page has been
							moved. Try these pages instead: <br />
							<div class="flex mt-10">
								<nuxt-link
									class="underline text-blue-600 mr-10"
									to="/"
								>
									Home
								</nuxt-link>
								<nuxt-link
									class="underline text-blue-600 mr-10"
									to="/features"
								>
									Features
								</nuxt-link>
								<nuxt-link
									class="underline text-blue-600 mr-10"
									to="/"
								>
									Pricing
								</nuxt-link>
							</div>
						</h2>
						<h2
							v-if="error.statusCode !== 404"
							class="py-20 text-xl md:text-3xl font-semibold relative z-10"
						>
							We messed up. You should not have seen this! <br />
							<div class="flex mt-10">
								<button
									class="btn btn-primary text-xl flex items-center px-10 inline-block py-2 bg-primary text-white rounded-full"
									@click="refresh()"
								>
									Go Back
									<i class="material-icons ml-2">refresh</i>
								</button>
							</div>
						</h2>
					</div>
					<div
						class="absolute opacity-75 md:relative md:w-3/5 px-20 py-20"
					>
						<img src="/svgs/blank_canvas.svg" alt="Error Image" />
					</div>
				</div>
			</div>
			<Footer v-if="error.statusCode === 404" :dark="true" />
		</div>
	</div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
export default {
	components: {
		Header,
		Footer,
	},
	props: {
		error: {
			type: Object,
			default() {
				return { statusCode: '' }
			},
			required: true,
		},
	},
	methods: {
		refresh() {
			this.$router.go(0)
		},
	},
}
</script>
