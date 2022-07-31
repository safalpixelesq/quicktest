<template>
	<ValidationProvider
		v-slot="{ errors }"
		:rules="field.rules"
		:mode="field.mode || 'aggressive'"
	>
		<label class="uk-form-label" :for="field.name">
			{{ field.label }}
		</label>
		<select
			:id="field.name"
			v-model="value"
			:value="field.value"
			:type="field.type"
			:name="field.name"
			class="uk-select"
		>
			<option
				v-for="option in field.options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.label }}
			</option>
		</select>
		<span class="uk-text-danger uk-text-small">
			{{ errors[0] }}
		</span>
	</ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
	name: 'SelectInput',
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
