<template class="">
	<div class="">
		<Header :dark="false" />
		<div>
			<nuxt />
		</div>
		<Footer :dark="true" :minimal="false" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
	components: {
		Header,
		Footer,
	},
	computed: {
		...mapGetters(['isAuthenticated', 'loggedInUser']),
	},
}
</script>

<style lang="scss">
.form {
	form.flex > span {
		@apply block mb-6;
	}

	form.flex > span span {
		@apply text-red-500 text-sm;
	}

	form.flex label {
		@apply text-gray-700 text-base font-medium mb-2 inline-block;
	}

	@screen sm {
		form.flex label {
			@apply block;
		}
	}

	form.flex input {
		@apply px-3 py-2 w-full rounded bg-white border;
	}

	form.flex input:focus,
	form.flex input:active {
		@apply px-3 py-2 w-full rounded bg-white;
	}
}
</style>
