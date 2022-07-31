<template>
	<ul uk-accordion>
		<li>
			<a href="#" class="uk-accordion-title">
				{{ label }}
			</a>
			<div class="uk-accordion-content">
				<draggable
					v-if="orderView"
					v-model="orderList"
					class="uk-margin-top"
					ghost-class="ghost"
				>
					<div
						v-for="(item, index) in orderList"
						:key="`item_${path}_${index}`"
						class="uk-tile uk-tile-muted uk-padding-small uk-margin"
					>
						<span
							class="
								uk-sortable-handle
								uk-margin-small-right
								uk-text-center
							"
							uk-icon="icon: table"
						>
						</span>
						{{ getItemLabel(index) }}
					</div>
				</draggable>
				<ul v-else uk-accordion>
					<li v-for="(cta, i) in fieldContext" :key="path + i">
						<a class="uk-accordion-title" href="#">
							<label class="uk-form-label">
								{{
									label +
									` - ${cta.label ? cta.label : i + 1}`
								}}
							</label>
						</a>
						<div class="uk-accordion-content">
							<TextField
								v-if="'label' in cta"
								field-name="label"
								:field-context="cta.label || ''"
								:parent-path="`${path}[${i}]`"
								class="uk-width-1-1 uk-margin-small"
							/>
							<TextField
								v-if="'url' in cta"
								field-name="url"
								:field-context="cta.url || ''"
								:parent-path="`${path}[${i}]`"
								class="uk-width-1-1 uk-margin-small"
							/>
							<HTMLField
								v-if="'description' in cta"
								field-name="description"
								:field-context="cta.description || ''"
								:parent-path="`${path}[${i}]`"
								class="uk-margin-small"
							/>
							<TextField
								v-if="'icon' in cta"
								field-name="icon"
								:field-context="cta.icon || ''"
								:parent-path="`${path}[${i}]`"
								class="uk-width-1-1 uk-margin-small"
							/>
							<SelectField
								v-if="'type' in cta"
								field-name="type"
								:field-context="cta.type || ''"
								:parent-path="`${path}[${i}]`"
								:options="typeOptions"
								class="uk-width-1-1 uk-margin-small"
							/>
							<SelectField
								v-if="'size' in cta"
								field-name="size"
								:field-context="cta.size || ''"
								:parent-path="`${path}[${i}]`"
								:options="sizeOptions"
								class="uk-width-1-1 uk-margin-small"
							/>
							<CheckBoxField
								v-if="'external' in cta"
								field-name="external"
								:field-context="cta.external || false"
								:parent-path="`${path}[${i}]`"
								class="uk-width-1-1 uk-margin-small"
							/>
							<NavigationColumnField
								v-if="'main' in cta"
								field-name="main"
								:field-context="cta.main || {}"
								:parent-path="`${path}[${i}]`"
							/>
							<NavigationColumnField
								v-if="'side' in cta"
								field-name="side"
								:field-context="cta.side || {}"
								:parent-path="`${path}[${i}]`"
							/>
							<CTAField
								v-if="'links' in cta"
								field-name="links"
								:field-context="cta.links || []"
								:parent-path="`${path}[${i}]`"
								class="uk-width-1-1 uk-margin-small"
							/>
							<div class="uk-flex">
								<button
									class="editor-button uk-button-secondary"
									@click.prevent="handleCTADuplicate(i)"
								>
									Duplicate
								</button>
								<button
									class="editor-button uk-button-danger"
									@click.prevent="handleCTADelete(i)"
								>
									Delete
								</button>
							</div>
						</div>
					</li>
				</ul>
				<div class="uk-flex">
					<button
						class="editor-button uk-button-secondary"
						@click="$modal.show(`add-cta-${path}-modal`)"
					>
						Add {{ label }}
					</button>
					<button
						v-if="orderList.length > 1"
						class="editor-button uk-button-default"
						@click="orderView = !orderView"
					>
						{{ orderView ? 'Editor' : 'Reorder' }}
					</button>
				</div>
				<vue-modal
					:name="`add-cta-${path}-modal`"
					height="auto"
					:width="400"
					:scrollable="true"
				>
					<div class="uk-modal-body">
						<h4>Create new {{ label }}</h4>
						<FormContainer
							:fields="filteredCTAFields"
							:submit-handler="createNewCTA"
							submit-label="Create CTA"
						/>
					</div>
				</vue-modal>
			</div>
		</li>
	</ul>
</template>

<script>
import { mapActions } from 'vuex'
import { startCase, toLower, truncate } from 'lodash'
import TextField from '@/components/content-field/TextField'
import HTMLField from '@/components/content-field/HTMLField'
import SelectField from '@/components/content-field/SelectField'
import CheckBoxField from '@/components/content-field/CheckBoxField'
import FormContainer from '@/components/form/FormContainer'
import NavigationColumnField from '@/components/content-field/NavigationColumnField'

export default {
	name: 'CTAField',
	components: {
		TextField,
		HTMLField,
		SelectField,
		CheckBoxField,
		FormContainer,
		NavigationColumnField,
	},
	props: {
		fieldContext: {
			type: Array,
			default: () => [],
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
		return { timeout: null, orderView: false }
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
		orderList: {
			get() {
				return this.fieldContext.map((f) => f)
			},
			set(value) {
				this.updateSectionByPath({
					path: this.path,
					value,
				})
			},
		},
		sizeOptions() {
			return [
				{
					label: 'Small',
					value: 'sm',
				},
				{
					label: 'Medium',
					value: 'md',
				},
				{
					label: 'Large',
					value: 'lg',
				},
			]
		},
		typeOptions() {
			return [
				{
					label: 'Default',
					value: 'default',
				},
				{
					label: 'Primary',
					value: 'primary',
				},
				{
					label: 'Secondary',
					value: 'secondary',
				},
				{
					label: 'Text',
					value: 'text',
				},
				{
					label: 'Link',
					value: 'link',
				},
				{
					label: 'Video',
					value: 'video',
				},
			]
		},
		cumulativeFields() {
			const fields = this.fieldContext.reduce((acc, curr) => {
				Object.keys(curr).forEach((f) => {
					acc[f] = 1
				})
				return acc
			}, {})
			return Object.keys(fields)
		},
		filteredCTAFields() {
			const allFields = [
				{
					name: 'label',
					label: 'Label',
					type: 'text',
					rules: 'required|min:2|max:256',
				},
				{
					name: 'url',
					label: 'URL',
					type: 'text',
					rules: 'required|min:2|max:256',
				},
				{
					name: 'description',
					label: 'Description',
					type: 'html',
					rules: '',
				},
				{
					name: 'icon',
					label: 'Icon',
					type: 'text',
					rules: '',
				},
				{
					name: 'type',
					label: 'Type',
					type: 'select',
					options: this.typeOptions,
					defaultValue: 'default',
				},
				{
					name: 'size',
					label: 'Size',
					type: 'select',
					options: this.sizeOptions,
					defaultValue: 'md',
				},
				{
					name: 'external',
					label: 'Link is external',
					type: 'checkbox',
					defaultValue: false,
				},
			]
			return this.cumulativeFields.length
				? allFields.filter((f) =>
						this.cumulativeFields.includes(f.name)
				  )
				: allFields
		},
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
		}),
		createNewCTA(data) {
			if (this.cumulativeFields.includes('main')) {
				data.main = { items: [] }
			}
			if (this.cumulativeFields.includes('side')) {
				data.side = { items: [] }
			}

			this.updateSectionByPath({
				path: `${this.path}[${this.fieldContext.length}]`,
				value: data,
			})
			this.$modal.hide(`add-cta-${this.path}-modal`)
		},
		handleCTADelete(index) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete ${this.label} ${
						index + 1
					} ?`,
					{
						labels: { ok: 'Delete', cancel: 'Cancel' },
					}
				)
				.then(() => {
					this.updateSectionByPath({
						path: this.path,
						value: index,
						deleteArrayValue: true,
					})
				})
		},
		getItemLabel(index) {
			const item = this.fieldContext[index]
			const label =
				item.label ||
				item.description ||
				item.url ||
				`${this.item} ${index + 1}`
			return truncate(label.replace(/<\/?[^>]+(>|$)/g, ''))
		},
		handleCTADuplicate(index) {
			this.updateSectionByPath({
				path: this.path,
				value: index,
				duplicateArrayValue: true,
			})
		},
	},
}
</script>
