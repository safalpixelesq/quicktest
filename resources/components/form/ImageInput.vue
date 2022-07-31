<template>
	<ValidationProvider
		v-slot="{ errors }"
		:rules="field.rules"
		:mode="field.mode || 'aggressive'"
	>
		<div class="uk-position-relative">
			<label class="uk-form-label" :for="field.name">
				{{ field.label }}
			</label>
			<div class="uk-flex">
				<input
					:id="field.name"
					v-model="value"
					type="text"
					class="uk-input"
					:name="field.name"
				/>
				<button
					uk-icon="album"
					class="uk-margin-small-left uk-icon-button"
					@click.prevent="libraryOpen = true"
				></button>
			</div>
			<span class="uk-text-danger uk-text-small">
				{{ errors[0] }}
			</span>

			<LibraryModal
				:open="libraryOpen"
				:close-handler="() => (libraryOpen = false)"
				:select-handler="updateValue"
			/>
		</div>
	</ValidationProvider>
</template>

<script>
import LibraryModal from '@/components/asset-library/LibraryModal'
import { ValidationProvider } from 'vee-validate'

export default {
	name: 'ImageInput',
	components: {
		LibraryModal,
		ValidationProvider,
	},
	props: {
		field: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			libraryOpen: false,
		}
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
		updateValue(selected) {
			this.$emit('input', selected.secure_url)
			this.libraryOpen = false
		},
	},
}
</script>
<style lang="scss" scoped>
.library-opener {
	background-color: white;
}
</style>
