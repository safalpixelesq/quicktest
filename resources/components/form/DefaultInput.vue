<template>
	<ValidationProvider
		v-slot="{ errors }"
		:rules="field.rules"
		:mode="field.mode || 'aggressive'"
	>
		<label class="uk-form-label" :for="field.name">
			{{ field.label }}
		</label>
		<input
			:id="field.name"
			v-model="value"
			:type="field.type"
			:name="field.name"
			class="uk-input"
			:step="field.step"
		/>
		<span class="uk-text-danger uk-text-small">
			{{ errors[0] }}
		</span>
	</ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
	name: 'DefaultInput',
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
