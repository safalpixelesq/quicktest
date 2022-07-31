<template>
	<div class="uk-width-3-4@m">
		<Notification
			v-if="notification.message"
			:message="notification.message"
			:type="notification.type"
		/>
		<div class="uk-card uk-card-default uk-card-body uk-margin-large-top">
			<h3 class="uk-text-bold uk-margin-small-bottom">
				Personal Access Token
			</h3>
			<p class="">
				This allows integration with our API. Treat your tokens like
				passwords and keep them secret.
			</p>
			<div class="uk-flex uk-flex-middle">
				<input
					v-if="token"
					v-model="token"
					class="uk-input"
					type="text"
					disabled="true"
					placeholder="Your token"
				/>
				<input
					v-if="!token"
					class="uk-input"
					type="text"
					disabled="true"
					value="xxxxxxxxxxxxxxxxxxxxxxxx"
				/>
				<button v-if="token" class="" @click="copyToken()">
					<i class="material-icons"> filter_none </i>
				</button>
			</div>

			<div>
				<span
					v-if="token"
					class="uk-margin-small-top uk-display-inline-block"
				>
					Copy your token and save it a safe place.
				</span>
				<span v-if="!token"
					>The
					<code class="uk-margin-small-top uk-display-inline-block"
						>Authorization = Bearer &lt;token&gt;</code
					>
					header must be set.</span
				>
			</div>
			<div class="uk-margin-top">
				<button
					v-if="hasToken"
					class="uk-button uk-button-default uk-button-small uk-margin-right"
					@click="revokeToken()"
				>
					<!-- <i class="material-icons">delete</i> -->
					Revoke
				</button>
				<button
					class="uk-button uk-button-primary uk-button-small"
					@click="generateToken()"
				>
					{{ hasToken ? 'Refresh' : 'Generate' }}
				</button>
			</div>
		</div>
		<div class="uk-card uk-card-default uk-card-body uk-margin-large-top">
			<h3 class="uk-text-bold uk-margin-small-bottom">
				Manage your Account
			</h3>
			<div>
				<ValidationObserver v-slot="{ reset }" ref="edit" mode="">
					<form
						class="mt-10 flex flex-col md:w-2/3"
						@submit.prevent=""
						@reset.prevent="reset"
					>
						<div
							v-for="field in fields"
							:key="field.label"
							class="uk-margin-top"
						>
							<ValidationProvider
								v-slot="{ errors }"
								:name="field.field"
								rules="required"
							>
								<div class="pt-4 px-4 sm:pt-8 sm:px-8">
									<label
										class="uk-form-label"
										:for="field.name"
									>
										{{ field.label }}
									</label>
									<input
										v-if="field.type === 'input'"
										v-model="loggedInUser[field.model]"
										:name="field.name"
										type="text"
										class="uk-input uk-width-1-1"
										:placeholder="field.label"
									/>
									<div
										v-if="field.type === 'select'"
										class="relative sm:w-2/3"
									>
										<select
											v-model="loggedInUser[field.model]"
											class="uk-input uk-width-1-1"
											name="library"
										>
											<option
												v-for="option in field.options"
												:key="option.value"
												:value="option.value"
											>
												{{ option.label }}
											</option>
										</select>
										<div
											class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
										>
											<svg
												class="fill-current h-4 w-4"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
											>
												<path
													d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
												/>
											</svg>
										</div>
									</div>
								</div>
								<span
									class="uk-text-danger uk-text-small uk-display-block"
								>
									{{ errors[0] }}
								</span>
								<button
									class="uk-button uk-button-primary uk-button-small uk-margin-top"
									@click="saveProfile()"
								>
									Save
								</button>
							</ValidationProvider>
						</div>
					</form>
				</ValidationObserver>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Notification from '@/components/Notification'

export default {
	components: {
		Notification,
		ValidationObserver,
		ValidationProvider,
	},
	layout: 'dashboard',
	data() {
		return {
			editMode: false,
			addToken: false,
			notification: {
				message: '',
				type: '',
			},
			fields: [
				{
					label: 'Your Name',
					field: 'username',
					type: 'input',
					model: 'username',
					help:
						'Enter your full name, or a display name that works for you.',
					rule: 'Required. Please use 32 characters at maximum.',
				},
				{
					label: 'Your Email',
					field: 'email',
					type: 'input',
					model: 'email',
					help:
						'Please enter the email address you want to use to log in with Pixelesq.',
					rule: 'We will email you to verify the change.',
				},
				{
					label: 'Change Password',
					field: 'password',
					type: 'input',
					model: 'password',
					help:
						'Please enter the email address you want to use to log in with Pixelesq.',
					rule: 'We will email you to verify the change.',
				},
			],
		}
	},
	computed: {
		...mapGetters(['isAuthenticated', 'loggedInUser']),
		hasToken() {
			return this.$store.state.user.hasToken
		},
		token() {
			return this.$store.state.user.token
		},
	},
	beforeCreate() {
		this.$store.dispatch('user/hideToken')
	},
	methods: {
		async generateToken() {
			await this.$store.dispatch('user/generateToken')
			await this.$store.dispatch('user/hasToken')
		},
		copyToken() {
			navigator.clipboard.writeText(this.token)
		},
		async revokeToken() {
			await this.$store.dispatch('user/revokeToken')
			await this.$store.dispatch('user/hideToken')
		},
		saveProfile() {
			this.$store.dispatch('user/saveProfile', this.loggedInUser)
		},
	},
}
</script>
