<template>
	<header
		:class="
			dark
				? 'uk-background-secondary uk-light'
				: 'uk-background-mted ' + 'uk-' + isdark
		"
	>
		<div
			class="uk-container pw-font-heading"
			:class="hasUser ? 'uk-container-expnd' : ''"
		>
			<nav class="uk-navbar">
				<div class="uk-navbar-left">
					<ul class="uk-navbar-nav">
						<li>
							<nuxt-link
								to="/"
								class="uk-flex uk-flex-middle"
								style="margin-left: -10px"
							>
								<Logo :colors="colors" :size="18"></Logo>
								<img
									:src="'/logotext-' + logoimg + '.svg'"
									class="text-gray-100"
									style="height: 30px; margin-left: 12px"
									alt=""
								/>
							</nuxt-link>
						</li>
					</ul>
				</div>
				<div class="uk-navbar-right">
					<ul class="uk-navbar-nav uk-visible@s">
						<li v-for="link in primary" :key="link.url">
							<nuxt-link
								:to="link.url"
								class="uk-margin-left uk-text-link uk-text-medium nav-link"
							>
								{{ link.title }}
							</nuxt-link>
						</li>
					</ul>

					<a
						href="#"
						class="uk-navbar-toggle uk-hidden@s"
						uk-navbar-toggle-icon
						uk-toggle="target: #sidenav"
					></a>
					<nuxt-link
						v-if="!hasUser"
						to="/login"
						class="uk-margin-left uk-button-small uk-button uk-button-primary btn uk-text-medium uk-visible@s"
					>
						Login
					</nuxt-link>
					<div v-if="hasUser" class="uk-text-bold uk-margin-left">
						<button
							class="uk-button-small uk-button uk-button-primary btn"
						>
							{{ user.username }}
						</button>
						<div
							class="uk-dropdown"
							data-uk-dropdown="pos:bottom-right"
						>
							<ul class="uk-nav uk-dropdown-nav">
								<li><a href="/projects">Dashboard</a></li>
								<li>
									<nuxt-link to="/account">Account</nuxt-link>
								</li>

								<li class="uk-nav-divider"></li>
								<li>
									<button
										id="signOut"
										class="uk-button uk-margin-small-top uk-button-text uk-text-primary"
										@click="logout"
									>
										Sign Out
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
		</div>
	</header>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
	name: 'Header',
	components: {
		Logo,
	},
	transition: 'default',
	props: {
		transparent: {
			type: Boolean,
			default() {
				return false
			},
		},
		dark: {
			type: Boolean,
			required: true,
		},
		heroBgStyles: {
			type: String,
			required: false,
			default() {
				return `background-color: #fff`
			},
		},
		colors: {
			type: Array,
			required: false,
			default() {
				return [
					{ color: '#FDC53F' },
					{ color: '#4777ED' },
					{ color: '#FB4D4A' },
					{ color: '#FB4D4A' },
					{ color: '#FDC53F' },
				]
			},
		},
		user: {
			type: [Object, Boolean],
			required: false,
			default() {
				return {
					email: 'placeholder',
				}
			},
		},
	},
	data() {
		return {
			isMenuOpen: false,
			mobileMenuOpen: false,
			primary: [
				{
					url: '/projects',
					title: 'Dashboard',
					external: false,
				},
			],
		}
	},
	computed: {
		logoimg() {
			return this.dark ? 'dark' : 'light'
		},
		isdark() {
			return this.dark ? 'light' : 'dark'
		},
		hasUser() {
			return this.user.username || false
		},
	},
	methods: {
		async logout() {
			await this.$auth.logout()
			await this.$router.push('/login')
		},
	},
}
</script>
<style lang="scss" scoped>
.nav-link.is-exact-active {
	color: var(--pw-primary) !important;
	font-weight: 600;
}
</style>
