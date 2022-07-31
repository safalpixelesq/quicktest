<template>
	<div class="">
		<Header :dark="false" :hero-bg-styles="'background: #efefef'" />
		<div class="form-bg">
			<div class="">
				<nuxt />
			</div>
		</div>
		<Footer :dark="true" />
	</div>
</template>

<script>
// import { mapGetters } from 'vuex'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
	components: {
		Header,
		Footer,
	},
	// computed: {
	// 	...mapGetters(['isAuthenticated', 'loggedInUser'])
	// }
}
</script>
<style scoped>
.form-bg {
	/* background: linear-gradient(to bottom, #fff 400px, #f2f2f2 400px); */
}
</style>
