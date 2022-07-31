<template>
	<div>
		<div class="uk-grid uk-margin">
			<div class="uk-width-2-3@m">
				<div class="uk-margin">
					<label
						class="uk-form-label"
						:for="'label' + cindex + itindex"
						>Label</label
					>
					<div class="uk-form-controls">
						<input
							v-model="label"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div class="uk-width-1-3@m">
				<div class="uk-margin" style="margin-top: 35px">
					<label
						><input
							v-model="external"
							class="uk-checkbox"
							type="checkbox"
							name="external"
						/>
						&nbsp;External</label
					>
				</div>
			</div>
		</div>
		<div>
			<div class="uk-margin">
				<label class="uk-form-label" :for="'url' + cindex + itindex"
					>URL</label
				>
				<div class="uk-form-controls">
					<input
						v-model="url"
						class="uk-input"
						type="text"
						placeholder=""
					/>
				</div>
			</div>
		</div>
		<div v-if="links" class="uk-margin-left">
			<div
				v-for="(cta, index) in links"
				:key="'mcta' + index"
				class="uk-margin-medium-bottom uk-margin-medium-top"
			>
				<div
					class="
						uk-flex
						uk-flex-between
						uk-flex-middle
						uk-margin-small-bottom
					"
				>
					<h5
						:id="'cta' + index + 1"
						class="uk-margin-remove-bottom uk-text-bold"
					>
						Primary Sub Link {{ index + 1 }}
					</h5>
					<div>
						<button
							type="button"
							class="uk-text-small uk-text-danger"
							data-uk-close
							@click="removeSublink('primary', index)"
						>
							<span class="uk-display-inline-block"
								>Remove &nbsp;</span
							>
						</button>
					</div>
				</div>
				<Sublink
					:ctx="cta"
					:sindex="index"
					:itindex="'primary' + index"
					@updateModuleCtxSubLink="updateModuleCtxSubLink"
				/>
			</div>
		</div>
		<button
			v-if="mode === 'primary'"
			class="
				uk-button
				uk-button-small
				uk-button-primary
				uk-margin-small-bottom
				uk-display-inline-block
				uk-margin-medium-bottom
				uk-margin-left
			"
			@click="openSublink"
		>
			Add Primary Sub Link
		</button>

		<div :id="'addSublink' + cindex" class="addsublink-modal" data-uk-modal>
			<div class="uk-modal-dialog">
				<ValidationObserver v-slot="{ invalid }">
					<button
						class="uk-modal-close-default"
						type="button"
						uk-close
					></button>
					<div class="uk-modal-header">
						<h4 class="uk-text-bold">Add Sub link</h4>
					</div>
					<div class="uk-modal-body">
						<div class="uk-grid uk-margin">
							<div class="uk-width-1-2@m">
								<div class="uk-margin">
									<ValidationProvider
										v-slot="{ errors }"
										name="Label"
										rules="req"
									>
										<label
											class="uk-form-label"
											for="nctalabel"
											>Label</label
										>
										<div class="uk-form-controls">
											<input
												v-model="newSublink.label"
												class="uk-input"
												type="text"
												placeholder=""
											/>
										</div>
										<span
											class="
												uk-text-danger
												uk-text-small
												uk-display-block
											"
											>{{ errors[0] }}</span
										>
									</ValidationProvider>
								</div>
							</div>
							<div class="uk-width-1-2@m">
								<div class="uk-margin" style="margin-top: 35px">
									<label
										><input
											v-model="newSublink.external"
											class="uk-checkbox"
											type="checkbox"
											name="external"
										/>
										&nbsp;External</label
									>
								</div>
							</div>
						</div>
						<div>
							<div class="uk-margin">
								<ValidationProvider
									v-slot="{ errors }"
									name="Url"
									rules="req|url|nospace"
								>
									<label class="uk-form-label" for="ctaurl"
										>URL</label
									>
									<div class="uk-form-controls">
										<input
											v-model="newSublink.url"
											class="uk-input"
											type="text"
											placeholder=""
										/>
									</div>
									<span
										class="
											uk-text-danger
											uk-text-small
											uk-display-block
										"
										>{{ errors[0] }}</span
									>
								</ValidationProvider>
							</div>
						</div>
					</div>
					<div class="uk-modal-footer uk-text-right">
						<button
							class="uk-button uk-button-default uk-modal-close"
							type="button"
						>
							Cancel
						</button>
						<button
							class="uk-button uk-button-primary uk-modal-close"
							type="button"
							:disabled="invalid"
							@click="addSublink(cindex)"
						>
							Save
						</button>
					</div>
				</ValidationObserver>
			</div>
		</div>
	</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import Sublink from '@/components/config/Sublink'
const _ = require('lodash')

export default {
	name: 'Navlink',
	components: {
		Sublink,
		ValidationProvider,
		ValidationObserver,
	},
	props: {
		ctx: {
			type: Object,
			required: true,
		},
		cindex: {
			type: Number,
			required: true,
		},
		itindex: {
			type: String,
			required: false,
			default: '30',
		},
		mode: {
			type: String,
			required: true,
		},
		parent: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			timeout: 1000,
			newSublink: {
				label: '',
				url: '',
				external: false,
			},
		}
	},
	computed: {
		label: {
			get() {
				return this.ctx.label
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const cta = _.clone(this.ctx)
					cta.label = value
					this.$emit(
						'updateModuleCtxLink',
						cta,
						this.cindex,
						this.mode,
						this.parent
					)
				}, 1000)
			},
		},
		external: {
			get() {
				return this.ctx.external || false
			},
			set(value) {
				const cta = _.clone(this.ctx)
				cta.external = value
				this.$emit(
					'updateModuleCtxLink',
					cta,
					this.cindex,
					this.mode,
					this.parent
				)
			},
		},
		url: {
			get() {
				return this.ctx.url
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const cta = _.clone(this.ctx)
					cta.url = value
					this.$emit(
						'updateModuleCtxLink',
						cta,
						this.cindex,
						this.mode,
						this.parent
					)
				}, 1000)
			},
		},
		links() {
			return this.ctx.links || []
		},
	},
	methods: {
		openSublink() {
			// this.navlinkmode = mode
			this.$uikit.modal(`#addSublink${this.cindex}`).show()
		},
		addSublink(cindex) {
			const parentlink = _.cloneDeep(this.ctx)
			parentlink.links = parentlink.links || []
			parentlink.links.push(this.newSublink)
			this.$emit(
				'updateModuleCtxLink',
				parentlink,
				this.cindex,
				'primary',
				false
			)
			this.newSublink = {}
			this.$uikit.modal('.addsublink-modal').hide()
		},
		removeSublink(type, index) {
			const primary = _.cloneDeep(this.ctx)
			primary.links.splice(index, 1)
			this.$emit(
				'updateModuleCtxLink',
				primary,
				this.cindex,
				'primary',
				false
			)
		},
		updateModuleCtxSubLink(payload, index) {
			const primary = _.cloneDeep(this.ctx)
			primary.links[index] = payload
			this.$emit(
				'updateModuleCtxLink',
				primary,
				this.cindex,
				'primary',
				false
			)
		},
	},
}
</script>
