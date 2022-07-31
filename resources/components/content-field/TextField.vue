<template>
	<div class="uk-flex uk-flex-bottom">
		<div class="uk-width-1-1">
			<DefaultInput
				class="uk-width-1-1"
				:field="{
					type: 'text',
					label: label,
					name: name,
					value,
					defaultValue: fieldContext,
				}"
				@input="handleInput($event)"
			/>
		</div>
		<ConnectorField :parent-path="path" :value="value" />
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { startCase, toLower } from 'lodash'
import DefaultInput from '@/components/form/DefaultInput'
import ConnectorField from '@/components/content-field/ConnectorField'

export default {
	name: 'TextField',
	components: { DefaultInput, ConnectorField },
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
		useParentPath: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return { timeout: null, value: '', dirty: false }
	},
	computed: {
		path() {
			return this.useParentPath
				? this.parentPath
				: `${this.parentPath}['${this.fieldName}']`
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
