<template>
	<div>
		<label class="uk-form-label" :for="name">
			<input
				v-model="value"
				:name="name"
				type="checkbox"
				class="uk-checkbox"
			/>
			{{ label }}
		</label>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { startCase, toLower } from 'lodash'

export default {
	name: 'CheckBoxField',
	props: {
		fieldContext: {
			type: Boolean,
			required: true,
		},
		fieldName: {
			type: String,
			required: true,
		},
		parentPath: {
			type: String,
			required: true,
		},
	},
	data() {
		return { timeout: null }
	},
	computed: {
		path() {
			return `${this.parentPath}['${this.fieldName}']`
		},
		label() {
			return startCase(toLower(this.fieldName))
		},
		name() {
			return toLower(this.fieldName)
		},
		value: {
			get() {
				return this.fieldContext
			},
			set(value) {
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.updateSectionByPath({
						path: this.path,
						value,
					})
				}, 1000)
			},
		},
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
		}),
	},
}
</script>
