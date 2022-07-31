<template>
	<section
		class="uk-dark uk-section form-bg uk-position-relative uk-overflow-hidden"
		uk-height-viewport="expand: true"
	>
		<div class="uk-container">
			<div class="uk-grid uk-flex uk-flex-center" data-uk-grid>
				<div class="uk-width-1-2@m">
					<div
						class="uk-margin-medium-top form-block uk-padding-large uk-position-relative"
					>
						<div class="tleft"></div>
						<div class="tright"></div>
						<h4
							class="uk-text-center uk-margin-small-top uk-margin-small-bottom uk-text-medium uk-text-primary uk-text-small"
						>
							FREE ACCOUNT
						</h4>
						<h1
							class="uk-text-center uk-text-bold uk-margin-small-bottom uk-margin-remove-top"
						>
							Sign Up
						</h1>
						<div class="uk-text-center uk-margin-bottom">
							Scale up fast! Automate webpage building. Decouple
							front-end code. Do it all with Pixelesq!
						</div>
						<Notification
							v-if="notification.message && !confirmEmail"
							:message="notification.message"
							:type="notification.type"
							class="mb-10"
						/>
						<div v-if="confirmEmail" id="confirmEmail" class="p-8">
							<div class="text-3xl">
								Thank you for signing up!
							</div>
							<div class="mt-4 text-lg">
								Please check your email to confirm your email
								address.
							</div>
							<div class="text-sm mt-4 text-gray-700">
								Please also check your spam folder.
							</div>
						</div>
						<div v-if="!confirmEmail" class="">
							<div class="social-logins">
								<div class="uk-flex uk-flex-between uk-grid">
									<div
										v-for="pvdr in logins"
										:key="pvdr.key"
										class="uk-width-1-2@m"
									>
										<a
											:href="
												apiurl +
												'/api/auth/social/' +
												pvdr.key
											"
											class="uk-text-left uk-flex uk-flex-middle each-link uk-margin-top"
										>
											<img
												class="uk-margin-small-left uk-margin-right"
												width="30px"
												:src="
													'/svgs/' + pvdr.key + '.svg'
												"
												alt=""
											/>
											<div class="">
												<div class="uk-text-small">
													Sign up with
												</div>
												<div
													class="uk-h4 uk-margin-remove-bottom uk-margin-remove-top uk-text-medium"
												>
													{{ pvdr.val }}
												</div>
											</div>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div v-if="!confirmEmail" class="">
							<!-- <hr /> -->
							<div class="uk-margin-medium-top">
								<span class="uk-text-large uk-text-muted"
									><hr class="uk-divider-icon" />
								</span>
							</div>
						</div>

						<button
							v-if="signupWithEmail"
							:href="apiurl + '/api/auth/social/' + pvdr"
							class="uk-button uk-button-default uk-text-left uk-margin-bottom uk-margin-medium-top"
							style="min-width: 230px"
							@click="signupWithEmail = true"
						>
							<i
								class="uk-icon uk-margin-small-right"
								data-uk-icon="mail"
							></i>
							Sign up with Email
						</button>

						<ValidationObserver
							v-if="!confirmEmail && !signupWithEmail"
							v-slot="{ handleSubmit, reset }"
							ref="signup"
							mode="eager"
							class="form block mt-8"
						>
							<form
								class="uk-form uk-form-stacked uk-margin-medium-top"
								@submit.prevent="handleSubmit(onSubmit)"
								@reset.prevent="reset"
							>
								<h4 class="uk-text-bold uk-text-center">
									Sign up with Email
								</h4>
								<div class="uk-margin">
									<ValidationProvider
										v-slot="{ errors }"
										name="name"
										rules="required|alpha_spaces|min:2|max:40"
									>
										<label class="uk-form-label" for="name">
											Full Name
										</label>
										<input
											id="name"
											v-model="name"
											type="text"
											class="uk-input uk-width-1-1"
											placeholder="Full Name"
										/>
										<span
											class="uk-text-danger uk-text-small uk-display-block"
											>{{ errors[0] }}</span
										>
									</ValidationProvider>
								</div>
								<div class="uk-margin">
									<ValidationProvider
										v-slot="{ errors }"
										name="email address"
										rules="required|email"
									>
										<label
											class="uk-form-label"
											for="email"
										>
											Email
										</label>
										<input
											id="email"
											v-model="email"
											type="email"
											class="uk-input uk-width-1-1"
											placeholder="Email address"
										/>
										<span
											class="uk-text-danger uk-text-small uk-display-block"
											>{{ errors[0] }}</span
										>
									</ValidationProvider>
								</div>
								<div class="uk-margin">
									<ValidationProvider
										v-slot="{ errors }"
										name="password"
										rules="required|min:8"
									>
										<label
											class="uk-form-label"
											for="password"
										>
											Password
										</label>
										<input
											id="password"
											v-model="password"
											type="password"
											class="uk-input uk-width-1-1"
											placeholder="Password"
										/>
										<span
											class="uk-text-danger uk-text-small uk-display-block"
											>{{ errors[0] }}</span
										>
									</ValidationProvider>
								</div>

								<button
									id="signUpSubmit"
									class="uk-margin-bottom uk-margin-top uk-button uk-button-primary btn uk-width-1-1"
									type="submit"
								>
									Submit
								</button>
							</form>
						</ValidationObserver>
						<hr />
						<div
							class="uk-text-center uk-position-relative signup-link uk-margin-medium-bottom"
						>
							Already have an account?
							<nuxt-link
								to="/login"
								class="uk-text-bold uk-text-primary"
								>Sign in</nuxt-link
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
// import axios from 'axios'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Notification from '@/components/Notification'

export default {
	name: 'SignUpForm',
	components: {
		Notification,
		ValidationObserver,
		ValidationProvider,
	},
	beforeRouteEnter(to, from, next) {
		let token = ''
		if (process.browser) {
			token = localStorage.getItem('uiaas-token')
		}

		return token ? next('/') : next()
	},
	layout: 'form',
	middleware: 'guest',
	data() {
		return {
			apiurl: process.env.API_URL || 'https://api.uiaas.io',
			logins: [
				{ key: 'google', val: 'Google' },
				{ key: 'github', val: 'Github' },
			],
			name: '',
			email: '',
			password: '',
			notification: {
				message: '',
				type: '',
			},
			confirmEmail: false,
			signupWithEmail: false,
			features: [
				{
					subtitle: 'Business-focused',
					title: 'Page builder',
					description:
						'Use our intuitive page builder to ideate, customize and build any UI within minutes. Qui officia eius atque alias soluta.',
					icon: 'move',
				},
				{
					subtitle: 'User-centric',
					title: 'Module Library',
					description:
						'Choose from ever growing library of modules. Qui officia eius atque alias soluta laboriosam voluptatem quasi debitis.',
					icon: 'album',
				},
				{
					subtitle: 'Pre-emptive',
					title: 'API Integration',
					description:
						'Use our back-end agnostic API to get UI. Qui officia eius atque alias soluta laboriosam voluptatem quasi debitis.',
					icon: 'code',
				},
				{
					subtitle: 'Pre-emptive',
					title: 'Deploy Anywhere',
					description:
						'The output is static html whcih can be deployed anywhere. Qui officia eius atque alias soluta laboriosam.',
					icon: 'upload',
				},
			],
		}
	},
	head() {
		return {
			title: 'Sign up | Pixelesq',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Free account. No credit card required.',
				},
			],
		}
	},
	computed: {
		isFormValid() {
			return Object.keys(this.fields).every(
				(key) => this.fields[key].valid
			)
		},
	},
	methods: {
		onSubmit() {
			this.$refs.signup.validate().then((success) => {
				if (!success) {
					return
				}
				// axios.defaults.baseURL = process.env.API_URL
				this.$axios.setBaseURL(this.apiurl)
				this.$axios
					.post('/api/auth/signup', {
						name: this.name,
						email: this.email,
						password: this.password,
					})
					.then((response) => {
						// save token in localstorage
						// eslint-disable-next-line no-console
						// console.log(JSON.stringify(response))
						this.$gtag.event('signup', { method: 'Email' })

						// localStorage.setItem('uiaas-token', response.data.token)
						// this.$auth.loginWith('local', {
						// 	data: {
						// 		email: this.email,
						// 		password: this.password
						// 	}
						// })
						this.confirmEmail = true
						// redirect to user home
						// this.$router.push('/dashboard')
					})
					.catch((error) => {
						// display error notification
						// eslint-disable-next-line no-console
						console.log(error.data)
						this.notification = Object.assign(
							{},
							this.notification,
							{
								message: `${error.data.message}`,
								type:
									'bg-red-600 text-gray-100 px-2 py-1 font-medium rounded',
							}
						)
					})
				// eslint-disable-next-line no-console
				console.log('Form has been submitted!')

				// Resetting Values
				this.name = this.password = this.email = ''

				// Wait until the models are updated in the UI
				this.$nextTick(() => {
					this.$refs.signup.reset()
				})
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.form-bg {
	background: linear-gradient(to bottom, #fff 30%, #f2f2f2 30%);
}
.form-block {
	background: #fff;
	border-radius: 20px;
	box-shadow: 0 4px 13px rgba(0, 0, 0, 0.15);
}
.tleft {
	position: absolute;
	width: 200px;
	height: 200px;
	top: 0;
	left: 0;
	background-image: url('/svgs/trigs-left.svg');
	background-size: contain;
	background-repeat: no-repeat;
}

.tright {
	position: absolute;
	width: 200px;
	height: 200px;
	right: 5px;
	bottom: -30px;
	background-image: url('/svgs/trigs-right.svg');
	background-size: contain;
	background-repeat: no-repeat;
	z-index: 0;
}
.each-link {
	border: 1px solid var(--pw-secondary);
	padding: 10px;
	border-radius: 10px;
	color: #121212;
	transition: 0.3s ease-out;
	.uk-h4 {
		transition: 0.3s ease-out;
	}
	&:hover {
		text-decoration: none;
		color: #fff;
		background-color: var(--pw-secondary);
		.uk-h4 {
			color: #fff;
		}
	}
}
.signup-link {
	z-index: 1;
}
</style>
