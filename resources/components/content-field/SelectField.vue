<template>
	<div>
		<label class="uk-form-label"> {{ label }} </label>
		<select v-model="value" :name="name" class="uk-select">
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.label }}
			</option>
		</select>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { startCase, toLower } from 'lodash'

export default {
	name: 'SelectField',
	props: {
		fieldContext: {
			type: String,
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
		options: {
			type: Array,
			default: () => [],
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
