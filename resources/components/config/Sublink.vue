<template>
	<div>
		<div class="uk-grid uk-margin">
			<div class="uk-width-2-3@m">
				<div class="uk-margin">
					<label
						class="uk-form-label"
						:for="'label' + sindex + itindex"
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
				<label class="uk-form-label" :for="'url' + sindex + itindex"
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
	</div>
</template>

<script>
const _ = require('lodash')

export default {
	name: 'Sublink',
	components: {},
	props: {
		ctx: {
			type: Object,
			required: true,
		},
		sindex: {
			type: Number,
			required: true,
		},
		itindex: {
			type: String,
			required: false,
			default: '30',
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
					this.$emit('updateModuleCtxSubLink', cta, this.sindex)
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
				this.$emit('updateModuleCtxSubLink', cta, this.sindex)
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
					this.$emit('updateModuleCtxSubLink', cta, this.sindex)
				}, 1000)
			},
		},
	},
	methods: {},
}
</script>
