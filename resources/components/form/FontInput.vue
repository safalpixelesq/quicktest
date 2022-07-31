<template>
	<div class="uk-position-relative">
		<ValidationProvider
			v-slot="{ errors }"
			:rules="field.rules"
			:mode="field.mode || 'aggressive'"
		>
			<label class="uk-form-label" :for="field.name">
				{{ field.label }}
			</label>
			<div class="uk-flex">
				<client-only>
					<font-picker
						class="uk-width-1-1"
						:api-key="'AIzaSyAqnoOkOSCRbfQjXsafidbTPuQ6L_Ol4Wk'"
						:active-font="value"
						@change="onFontSelect"
					></font-picker>
				</client-only>
			</div>
			<!-- <div v-if="value.variants" class="uk-margin-top">
				<select
						class="uk-select"
						name="font_variant"
						@change="onVariantSelect"
					>
						<option v-for="v in value.variants" :key="v" :value="v">
							{{ v }}
						</option>
					</select>
			</div> -->
			<span class="uk-text-danger uk-text-small">
				{{ errors[0] }}
			</span>
		</ValidationProvider>
	</div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
export default {
	name: 'FontInput',
	components: {
		ValidationProvider,
	},
	props: {
		field: {
			type: Object,
			required: true,
		},
	},
	computed: {
		value: {
			get() {
				return this.field.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},
	},
	methods: {
		onFontSelect(font) {
			this.value = font.family
		},
		// onVariantSelect(e) {
		// 	this.$emit('input', {
		// 		...this.value,
		// 		selectedVariant: e.target.value,
		// 	})
		// },
	},
}
</script>

<style lang="scss">
#font-picker {
	padding: 0;
	box-shadow: none !important;

	.dropdown-button {
		height: 40px;
		border: 1px solid #e5e5e5;
		background-color: transparent !important;
	}

	.expanded {
		margin-top: 4px;
		background-color: white !important;
	}
}
</style>
