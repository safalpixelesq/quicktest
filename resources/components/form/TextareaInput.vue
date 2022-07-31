<template>
	<ValidationProvider
		v-slot="{ errors }"
		:rules="field.rules"
		:mode="field.mode || 'aggressive'"
	>
		<label class="uk-form-label" :for="field.name">
			{{ field.label }}
		</label>
		<textarea
			:id="field.name"
			v-model="value"
			:style="field.style || {}"
			:type="field.type"
			:name="field.name"
			class="uk-textarea"
		>
		</textarea>

		<span class="uk-text-danger uk-text-small">
			{{ errors[0] }}
		</span>
	</ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
	name: 'TextareaInput',
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
