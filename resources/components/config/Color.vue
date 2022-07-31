<template>
	<div>
		<p class="uk-text-meta uk-margin-small-bottom">
			{{ !item ? 'Text Color' : 'Item Text Color' }}
		</p>
		<div class="uk-flex uk-flex-middle">
			<v-swatches
				v-model.lazy="color"
				class="uk-margin-small-right"
				shapes="circles"
				popover-x="right"
				:trigger-style="{
					width: '38px',
					height: '38px',
					border: '1px solid var(--pw-tertiary)',
				}"
				show-border
				show-fallback
				fallback-input-type="color"
			></v-swatches>

			<input
				v-model="color"
				placeholder="Choose or input color"
				type="text"
				class="config-button text-input"
			/>

			<button
				v-if="color !== ''"
				class="uk-button uk-button-link"
				@click="resetColor"
			>
				Reset
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Color',
	props: {
		config: {
			type: Object,
			required: true,
		},
		item: {
			type: Boolean,
			required: false,
		},
	},
	data() {
		return {
			timeout: null,
		}
	},
	computed: {
		color: {
			get() {
				return this.config.color
			},
			set(col) {
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.$emit('updateModule', {
						[`${this.item ? 'itemColor' : 'color'}`]: col,
					})
				}, 500)
			},
		},
	},
	methods: {
		resetColor() {
			this.$emit('updateModule', {
				[`${this.item ? 'itemColor' : 'color'}`]: '',
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.config-button.text-input {
	border: 1px solid #ddd;
	outline: none;
	transition: width ease-in-out 0.5s;
	width: 100%;
	border-radius: 21px;
	border-color: var(--pw-tertiary);
	text-align: left;
	padding-left: 15px;
	padding-right: 15px;
	margin-right: 10px;
	&:hover,
	&:focus {
		outline: none;
	}
}
.vue-swatches__diagonal__wrapper {
	opacity: 0.2;
}
.vue-swatches__diagonal {
	background: blue !important;
}
</style>
