<template>
	<div>
		<div class="uk-grid uk-margin">
			<div class="uk-width-1-2@m">
				<div class="uk-margin">
					<label
						class="uk-form-label"
						:for="'label' + cindex + itindex"
						>Label</label
					>
					<div class="uk-form-controls">
						<input
							:id="'label' + cindex + itindex"
							v-model="label"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div class="uk-width-1-2@m">
				<div class="uk-margin">
					<label class="uk-form-label" for="type">Type</label>
					<div class="uk-form-controls">
						<select v-model="type" class="uk-select">
							<option value="default">Default</option>
							<option value="primary">Primary</option>
							<option value="secondary">Secondary</option>
							<option value="text">Text</option>
							<option value="link">Link</option>
							<option value="video">Video</option>
						</select>
					</div>
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
						:id="'url' + cindex + itindex"
						v-model="url"
						class="uk-input"
						type="text"
						placeholder=""
					/>
				</div>
			</div>
		</div>
		<div class="uk-grid uk-margin">
			<div class="uk-width-1-2@m">
				<div class="uk-margin">
					<label
						class="uk-form-label"
						:for="'size' + cindex + itindex"
						>Size</label
					>
					<div class="uk-form-controls">
						<select
							:id="'size' + cindex + itindex"
							v-model="size"
							class="uk-select"
						>
							<option value="sm">Small</option>
							<option value="md">Medium</option>
							<option value="lg">Large</option>
						</select>
					</div>
				</div>
			</div>
			<div class="uk-width-1-2@m">
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
	</div>
</template>

<script>
const _ = require('lodash')

export default {
	name: 'Cta',
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
			type: Number,
			required: false,
			default: 30,
		},
	},
	data() {
		return {}
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
					this.$emit('updateModuleCtxCta', cta, this.cindex)
				}, 1000)
			},
		},
		type: {
			get() {
				return this.ctx.type
			},
			set(value) {
				const cta = _.clone(this.ctx)
				cta.type = value
				this.$emit('updateModuleCtxCta', cta, this.cindex)
			},
		},
		external: {
			get() {
				return this.ctx.external || false
			},
			set(value) {
				const cta = _.clone(this.ctx)
				cta.external = value
				this.$emit('updateModuleCtxCta', cta, this.cindex)
			},
		},
		size: {
			get() {
				return this.ctx.size
			},
			set(value) {
				const cta = _.clone(this.ctx)
				cta.size = value
				this.$emit('updateModuleCtxCta', cta, this.cindex)
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
					this.$emit('updateModuleCtxCta', cta, this.cindex)
				}, 1000)
			},
		},
	},
	methods: {},
}
</script>
