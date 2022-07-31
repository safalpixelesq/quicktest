<template>
	<ValidationProvider v-slot="{ errors }" :rules="field.rules">
		<label class="uk-form-label" :for="field.name">
			<input
				:id="field.name"
				v-model="value"
				:type="field.type"
				:checked="field.value"
				:name="field.name"
				class="uk-checkbox"
			/>
			{{ field.label }}
		</label>

		<span class="uk-text-danger uk-text-small">
			{{ errors[0] }}
		</span>
	</ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
	name: 'CheckboxInput',
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
