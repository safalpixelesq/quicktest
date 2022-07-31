<template>
	<ul uk-accordion>
		<li>
			<a href="#" class="uk-accordion-title">
				{{ label }}
			</a>
			<div class="uk-accordion-content">
				<div v-if="typeof fieldContext === 'string'" class="uk-flex">
					<PreviewUploadField
						style="width: 30%"
						field-name="src"
						:field-context="fieldContext"
						:parent-path="path"
						:use-parent-path="true"
					/>
					<TextField
						class="uk-width-1-1"
						field-name="src"
						:field-context="fieldContext"
						:parent-path="path"
						:use-parent-path="true"
					/>
				</div>
				<div v-else class="uk-flex">
					<PreviewUploadField
						v-if="imageURLField in value"
						style="width: 30%"
						:field-name="imageURLField"
						:field-context="fieldContext[imageURLField]"
						:parent-path="path"
					/>
					<div class="uk-width-1-1">
						<TextField
							v-if="'src' in value"
							field-name="src"
							:field-context="fieldContext.src || ''"
							:parent-path="path"
						/>
						<TextField
							v-if="'url' in value"
							field-name="url"
							:field-context="fieldContext.url || ''"
							:parent-path="path"
						/>
						<TextField
							v-if="'label' in value"
							field-name="label"
							:field-context="fieldContext.label || ''"
							:parent-path="path"
						/>
						<TextField
							v-if="'caption' in value"
							field-name="caption"
							:field-context="fieldContext.caption || ''"
							:parent-path="path"
						/>
						<TextField
							v-if="'tagline' in value"
							field-name="tagline"
							:field-context="fieldContext.tagline || ''"
							:parent-path="path"
						/>
						<TextField
							v-if="'alt' in value"
							field-name="alt"
							:field-context="fieldContext.alt || ''"
							:parent-path="path"
						/>
					</div>
				</div>
			</div>
		</li>
	</ul>
</template>

<script>
import PreviewUploadField from '@/components/content-field/PreviewUploadField'
import TextField from '@/components/content-field/TextField'
import { mapActions } from 'vuex'
import { startCase, toLower } from 'lodash'

export default {
	name: 'MediaField',
	components: { TextField, PreviewUploadField },
	props: {
		fieldContext: {
			type: [Object, String],
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
		return { libraryOpen: false, timeout: null }
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
		imageURLField() {
			return this.fieldName === 'image' ? 'url' : 'src'
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
		titleCase(str) {
			return startCase(toLower(str))
		},
	},
}
</script>
<style lang="scss" scoped>
.uk-input {
	font-size: 12px;
}
</style>
