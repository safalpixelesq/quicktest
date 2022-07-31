<template>
	<section
		class="uk-dark uk-section form-bg uk-position-relative uk-overflow-hidden"
		uk-height-viewport="expand: true"
	>
		<div class="uk-container">
			<div class="uk-grid uk-flex uk-flex-center">
				<div class="uk-width-1-2@m">
					<div
						class="uk-margin-medium-top form-block uk-padding-large uk-position-relative"
					>
						<div class="tleft"></div>
						<div class="tright"></div>
						<h4
							class="uk-text-center uk-margin-small-top uk-margin-small-bottom uk-text-medium uk-text-primary uk-text-small"
						>
							WELCOME BACK
						</h4>
						<h1
							class="uk-text-center uk-text-bold uk-h2 uk-margin-small-bottom uk-margin-remove-top"
						>
							Sign in
						</h1>
						<div class="">
							<div class="social-logins">
								<div class="uk-flex uk-flex-between uk-grid">
									<div
										v-for="pvdr in logins"
										:key="pvdr.key"
										class="uk-width-1-2@m"
									>
										<a
											:href="
												'/api/auth/social/' + pvdr.key
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
													Sign in with
												</div>
												<div
													class="uk-h4 uk-margin-remove-bottom uk-margin-remove-top uk-text-medium"
												>
													{{ pvdr.val }}
												</div>
											</div></a
										>
									</div>
								</div>
							</div>
							<hr class="uk-margin-medium-top" />
							<div
								id="emailBox"
								class="uk-margin-medium-top uk-margin-bottom"
							>
								<Notification
									v-if="notification.message"
									:message="notification.message"
									:type="notification.type"
								/>
								<ValidationObserver
									v-slot="{ handleSubmit, reset }"
									ref="login"
									mode="eager"
									class=""
								>
									<form
										class=""
										@submit.prevent="handleSubmit(onSubmit)"
										@reset.prevent="reset"
									>
										<div class="uk-margin">
											<ValidationProvider
												v-slot="{ errors }"
												name="E-mail"
												rules="required|email"
											>
												<label
													class="uk-form-label"
													for="email"
													>Email Address</label
												>
												<div class="uk-form-controls">
													<input
														id="email"
														v-model="email"
														type="email"
														class="uk-input"
														placeholder="Email address"
													/>
													<span
														class="uk-text-danger uk-text-small"
														>{{ errors[0] }}</span
													>
												</div>
											</ValidationProvider>
										</div>
										<div class="uk-margin">
											<ValidationProvider
												v-slot="{ errors }"
												name="Password"
												rules="required"
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
													class="uk-input"
													placeholder="Password"
												/>
												<span
													class="uk-text-danger uk-text-small"
													>{{ errors[0] }}</span
												>
												<div
													class="uk-text-right uk-margin-small-top"
												>
													<nuxt-link
														id="forgotPwd"
														to="/forgot-password"
														class="uk-text-primary uk-text-small uk-button-text uk-text-medium"
														>Forgot
														Password?</nuxt-link
													>
												</div>
											</ValidationProvider>
										</div>

										<button
											id="signInSubmit"
											class="uk-button uk-button-primary btn uk-width-1-1"
											type="submit"
										>
											Submit
										</button>
									</form>
								</ValidationObserver>
							</div>

							<hr />
							<div
								class="uk-text-center uk-position-relative signup-link uk-margin-medium-bottom"
							>
								Need an account?
								<nuxt-link
									to="/signup"
									class="uk-text-bold uk-text-primary"
									>Sign up</nuxt-link
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Notification from '@/components/Notification'

export default {
	name: 'LoginForm',
	components: {
		Notification,
		ValidationObserver,
		ValidationProvider,
	},
	layout: 'form',
	middleware: 'guest',
	data() {
		return {
			logins: [
				{ key: 'google', val: 'Google' },
				{ key: 'github', val: 'Github' },
			],
			token: this.$route.query.tkn ? this.$route.query.tkn : null,
			email: '',
			password: '',
			notification: {
				message: '',
				type: '',
			},
		}
	},
	head() {
		return {
			title: 'Login | Pixelesq',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content:
						'Free account + 14 day free trial for all premium features. No credit card required.',
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
	mounted() {
		// eslint-disable-next-line no-console
		if (this.token) {
			// eslint-disable-next-line no-console
			const auth = this.$auth
			try {
				auth.setToken('local', 'Bearer ' + this.token)
				this.$axios.setToken(this.token, 'Bearer')
				setTimeout(() => {
					auth.setStrategy('local')
					setTimeout(async () => {
						await auth.fetchUser()
					})
				})
				this.$router.push('/modules')
			} catch (error) {
				this.notification = Object.assign({}, this.notification, {
					message: error.message,
					type:
						'bg-red-600 text-gray-100 px-2 py-1 font-medium rounded',
				})
			}
		}
	},
	methods: {
		async onSubmit() {
			try {
				await this.$auth
					.loginWith('local', {
						data: {
							email: this.email,
							password: this.password,
						},
					})
					.then((res) => {
						this.$axios.setToken(res.data.token, 'Bearer')
					})

				this.$gtag.event('login', { method: 'Email' })
				this.$router.push('/dashboard')
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(JSON.stringify(error))
				this.notification = Object.assign({}, this.notification, {
					message: `${error.data.message}`,
					type:
						'bg-red-600 text-gray-100 px-2 py-1 font-medium rounded',
				})
			}
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
