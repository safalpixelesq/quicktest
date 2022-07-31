<template>
	<iframe
		:src="'data:text/html,' + encodeURIComponent(preview)"
		frameborder="0"
		style="display: block; height: 100vh; width: 100vw; border: none"
	></iframe>
</template>

<script>
import { mapState } from 'vuex'

export default {
	data() {
		return {
			fullPage: [],
			partials: {},
		}
	},
	async fetch({ store, params, query }) {
		await store.dispatch('pages/previewPage', {
			project: params.slug,
			page: params.pageid,
			version: query.version,
		})
	},

	computed: {
		...mapState({
			preview: (state) => state.pages.preview,
		}),
	},
	mounted() {
		// console.log(this.preview)
	},
}
</script>
