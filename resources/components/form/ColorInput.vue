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
			<div class="uk-flex uk-flex-middle">
				<div class="uk-margin-small-right">
					<v-swatches
						v-model="value"
						popover-x="right"
						show-fallback
						fallback-input-type="color"
						:trigger-style="{
							height: '36px',
							width: '36px',
							marginTop: '6px',
							borderRadius: 0,
							border: '1px solid #e5e5e5',
						}"
					></v-swatches>
				</div>
				<input
					:id="field.name"
					v-model="value"
					type="text"
					class="uk-input"
					:name="field.name"
				/>
			</div>
			<span class="uk-text-danger uk-text-small">
				{{ errors[0] }}
			</span>
		</ValidationProvider>
	</div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
export default {
	name: 'ColorInput',
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
}
</script>
