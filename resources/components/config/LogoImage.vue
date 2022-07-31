<template>
	<div>
		<div class="uk-margin">
			<label class="uk-form-label" :for="'imgurl' + idx">Logo URL</label>
			<div class="uk-form-controls">
				<input
					:id="'imgurl' + idx"
					v-model="src"
					class="uk-input"
					type="text"
					placeholder=""
				/>
			</div>
		</div>
		<div class="uk-grid uk-margin uk-grid-small">
			<div class="uk-width-1-2@m">
				<div class="">
					<label class="uk-form-label uk-display-block"
						>Preview</label
					>
					<img v-if="src" :src="src" :alt="label" />
					<div
						v-if="!src"
						class="
							uk-placeholder
							uk-text-center
							uk-text-bold
							uk-margin-remove-vertical
						"
						style="padding: 49px 30px"
					>
						Add Logo
					</div>
				</div>
			</div>
			<div class="uk-width-1-2@m">
				<div class="uk-margin">
					<label class="uk-form-label" :for="'imgcap' + idx"
						>Label</label
					>
					<div class="uk-form-controls">
						<input
							:id="'imgcap' + idx"
							v-model="label"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" :for="'imagalt' + idx"
						>Tagline</label
					>
					<div class="uk-form-controls">
						<input
							:id="'imagalt' + idx"
							v-model="tagline"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const _ = require('lodash')

export default {
	name: 'LogoImage',
	props: {
		ctx: {
			type: Object,
			required: true,
		},
		item: {
			type: Boolean,
			required: false,
		},
		idx: {
			type: String,
			required: true,
		},
	},
	data() {
		return {}
	},
	computed: {
		src: {
			get() {
				return this.ctx.src
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.src = value
					this.$emit('updateModuleCtxLogo', image, this.item)
				}, 1000)
			},
		},
		url: {
			get() {
				return this.ctx.url
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.url = value
					this.$emit('updateModuleCtxLogo', image, this.item)
				}, 1000)
			},
		},
		tagline: {
			get() {
				return this.ctx.tagline
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.tagline = value
					this.$emit('updateModuleCtxLogo', image, this.item)
				}, 1000)
			},
		},
		label: {
			get() {
				return this.ctx.label
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.label = value
					this.$emit('updateModuleCtxLogo', image, this.item)
				}, 1000)
			},
		},
	},
	methods: {},
}
</script>
