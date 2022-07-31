<template>
	<ul uk-accordion>
		<li>
			<a href="#" class="uk-accordion-title"> Items </a>
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
					<li
						v-for="(item, index) in fieldContext"
						:key="`item_${path}_${index}`"
					>
						<a
							class="uk-accordion-title uk-inline uk-width-1-1"
							href="#"
						>
							{{ getItemLabel(index) }}
						</a>
						<div class="uk-accordion-content">
							<component
								:is="`pq_${field}`"
								v-for="(field, i) in validFields(item)"
								:key="`ef_${path}_${i}`"
								:field-name="field"
								:field-context="
									fieldContext[index][field] ||
									getDefaultValue(field)
								"
								:parent-path="`${path}[${index}]`"
								class="uk-margin"
							>
							</component>
							<div class="uk-flex">
								<button
									class="editor-button uk-button-secondary"
									@click.prevent="handleItemDuplicate(index)"
								>
									Duplicate
								</button>
								<button
									class="editor-button uk-button-danger"
									@click.prevent="handleItemDelete(index)"
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
						@click="$modal.show(`add-item-${path}-modal`)"
					>
						Add Item
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
					:name="`add-item-${path}-modal`"
					height="auto"
					:width="400"
					:scrollable="true"
				>
					<div class="uk-modal-body">
						<h4>Create new item</h4>
						<FormContainer
							:fields="filteredItemFields"
							:submit-handler="createNewItem"
							submit-label="Create Item"
						/>
					</div>
				</vue-modal>
			</div>
		</li>
	</ul>
</template>

<script>
import { mapActions } from 'vuex'
import { startCase, toLower, cloneDeep, truncate } from 'lodash'
import FormContainer from '@/components/form/FormContainer'
const editorFieldsMap = {
	pq_title: () => import('@/components/content-field/HTMLField'),
	pq_subtitle: () => import('@/components/content-field/HTMLField'),
	pq_description: () => import('@/components/content-field/HTMLField'),
	pq_icon: () => import('@/components/content-field/TextField'),
	pq_logo: () => import('@/components/content-field/MediaField'),
	pq_image: () => import('@/components/content-field/MediaField'),
	pq_ctas: () => import('@/components/content-field/CTAField'),
	pq_primary: () => import('@/components/content-field/CTAField'),
	pq_secondary: () => import('@/components/content-field/CTAField'),
	pq_social: () => import('@/components/content-field/CTAField'),
	pq_items: () => import('@/components/content-field/ItemsField'),
}
export default {
	name: 'ItemsField',
	components: { ...editorFieldsMap, FormContainer },
	props: {
		fieldContext: {
			type: Array,
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
		return {
			orderView: false,
		}
	},
	computed: {
		path() {
			return `${this.parentPath}['${this.fieldName}']`
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
		filteredItemFields() {
			const allFields = [
				{
					name: 'subtitle',
					label: 'Subtitle',
					type: 'html',
				},
				{
					name: 'title',
					label: 'Title',
					type: 'html',
				},
				{
					name: 'description',
					label: 'Description',
					type: 'html',
				},
				{
					name: 'icon',
					label: 'Icon',
					type: 'text',
				},
			]
			return this.cumulativeFields.length
				? allFields.filter((f) =>
						this.cumulativeFields.includes(f.name)
				  )
				: allFields
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
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
		}),
		titleCase(str) {
			return startCase(toLower(str))
		},
		validFields(item) {
			if (typeof item !== 'object') {
				return []
			}
			return Object.keys(item).filter(
				(field) => !!editorFieldsMap[`pq_${field}`]
			)
		},
		getDefaultValue(field) {
			if (
				['ctas', 'items', 'primary', 'secondary', 'social'].includes(
					field
				)
			) {
				return []
			} else {
				return ''
			}
		},
		createNewItem(data) {
			;['image', 'logo', 'ctas'].forEach((field) => {
				if (this.cumulativeFields.includes(field)) {
					data[field] = this.emptifyValues(
						this.fieldContext[0][field]
					)
				}
			})

			this.updateSectionByPath({
				path: `${this.path}[${this.fieldContext.length}]`,
				value: data,
			})
			this.$modal.hide(`add-item-${this.path}-modal`)
		},
		emptifyValues(obj) {
			if (!obj) return null
			const newObj = cloneDeep(obj)

			Object.entries(newObj).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					newObj[key] = []
				} else if (typeof value === 'object' && value !== null) {
					newObj[key] = this.emptifyValues(value)
				} else {
					newObj[key] = ''
				}
			})
			return newObj
		},
		handleItemDelete(index) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete the item ${index + 1} ?`,
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
		handleItemDuplicate(index) {
			this.updateSectionByPath({
				path: this.path,
				value: index,
				duplicateArrayValue: true,
			})
		},
		getItemLabel(index) {
			const item = this.fieldContext[index]
			const label = item.title || item.description || `Item ${index + 1}`

			return typeof label === 'string'
				? truncate(label.replace(/<\/?[^>]+(>|$)/g, ''))
				: label
		},
	},
}
</script>
