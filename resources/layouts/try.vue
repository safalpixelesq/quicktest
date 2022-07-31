<template>
	<div class="">
		<Header :dark="false" :hero-bg-styles="'background: #efefef'" />
		<div class="flex-grow">
			<nuxt />
		</div>
		<!-- <Footer :dark="true" /> -->
	</div>
</template>

<script>
// import { mapGetters } from 'vuex'
import Header from '@/components/Header'
// import Footer from '@/components/Footer'

export default {
	components: {
		Header,
		// Footer,
	},
	// computed: {
	// 	...mapGetters(['isAuthenticated', 'loggedInUser'])
	// }
}
</script>
