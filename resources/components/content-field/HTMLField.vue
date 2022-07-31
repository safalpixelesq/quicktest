<template>
	<div class="uk-flex uk-flex-bottom">
		<WizzyInput
			class="uk-width-1-1"
			:field="{
				label: label,
				name: name,
				value,
				defaultValue: fieldContext,
			}"
			@input="handleInput($event)"
		/>
		<ConnectorField :parent-path="path" :value="value" />
	</div>
</template>

<script>
import WizzyInput from '@/components/form/WizzyInput'
import ConnectorField from '@/components/content-field/ConnectorField'
import { mapActions } from 'vuex'
import { startCase, toLower } from 'lodash'

export default {
	name: 'HTMLField',
	components: { WizzyInput, ConnectorField },
	props: {
		fieldContext: {
			type: [String, Number],
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
		return { timeout: null, value: '' }
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
	},
	watch: {
		value() {
			if (this.dirty) {
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					if (this.value.includes('$pq_connect')) {
						this.setConnection({
							[this.path]: this.value,
						})
					}
					this.updateSectionByPath({
						path: this.path,
						value: this.value,
					})
				}, 1000)
			}
		},
		fieldContext() {
			this.value = this.fieldContext
		},
	},
	mounted() {
		this.value = this.fieldContext
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
			setConnection: 'editors/setConnection',
		}),
		handleInput(val) {
			this.dirty = true
			this.value = val
		},
	},
}
</script>
