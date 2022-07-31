<template>
	<div class="navigation-accordion-box">
		<ul uk-accordion>
			<li>
				<a href="#" class="uk-accordion-title">
					<label class="uk-form-label"> {{ label }}s </label>
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
							class="
								uk-tile uk-tile-muted uk-padding-small uk-margin
							"
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
							v-for="(item, index) in fieldContext.items"
							:key="'mcta' + index"
							class="accordion-item"
						>
							<a class="uk-accordion-title" href="#">
								<label class="uk-form-label">
									{{ getItemLabel(index) }}
								</label>
							</a>
							<div class="uk-accordion-content">
								<HTMLField
									v-if="'title' in item"
									field-name="title"
									:field-context="item.title || ''"
									:parent-path="`${path}[${index}]`"
									class="uk-margin"
								/>
								<HTMLField
									v-if="'description' in item"
									field-name="description"
									:field-context="item.description || ''"
									:parent-path="`${path}[${index}]`"
									class="uk-margin"
								/>
								<MediaField
									v-if="'icon' in item"
									field-name="icon"
									:field-context="item.icon || ''"
									:parent-path="`${path}[${index}]`"
									class="uk-margin"
								/>
								<MediaField
									v-if="'image' in item"
									field-name="image"
									:field-context="item.image || ''"
									:parent-path="`${path}[${index}]`"
									class="uk-margin"
								/>
								<CTAField
									v-if="'ctas' in item"
									field-name="ctas"
									:field-context="item.ctas || []"
									:parent-path="`${path}[${index}]`"
									class="uk-margin"
								/>
								<div class="uk-flex">
									<button
										class="
											editor-button
											uk-button-secondary
										"
										@click.prevent="
											handleNavColDuplicate(index)
										"
									>
										Duplicate
									</button>
									<button
										class="editor-button uk-button-danger"
										@click.prevent="
											handleNavColDelete(index)
										"
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
							@click="$modal.show(`add-nav-col-${path}-modal`)"
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
						:name="`add-nav-col-${path}-modal`"
						height="auto"
						:width="400"
						:scrollable="true"
					>
						<div class="uk-modal-body">
							<h4>Create new {{ fieldName }} column</h4>
							<FormContainer
								:fields="createNavColFields"
								:submit-handler="createNewNavCol"
								submit-label="Create column"
							/>
						</div>
					</vue-modal>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { startCase, toLower, truncate } from 'lodash'
import HTMLField from '@/components/content-field/HTMLField'
import MediaField from '@/components/content-field/MediaField'
import FormContainer from '@/components/form/FormContainer'

export default {
	name: 'NavigationColumnField',
	components: {
		CTAField: () => import('@/components/content-field/CTAField'),
		MediaField,
		HTMLField,
		FormContainer,
	},
	props: {
		fieldContext: {
			type: Object,
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
		return { timeout: null, orderView: false }
	},
	computed: {
		path() {
			return `${this.parentPath}['${this.fieldName}'].items`
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
				return this.fieldContext.items.map((f) => f)
			},
			set(value) {
				this.updateSectionByPath({
					path: this.path,
					value,
				})
			},
		},
		createNavColFields() {
			return [
				{
					name: 'title',
					label: 'Title',
					type: 'html',
					rules: '',
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
					type: 'image',
					rules: 'url',
				},
				{
					name: 'image',
					label: 'Image',
					type: 'image',
					rules: 'url',
				},
			]
		},
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
		}),
		createNewNavCol(data) {
			data.ctas = []
			this.updateSectionByPath({
				path: `${this.path}[${this.fieldContext.items.length}]`,
				value: data,
			})
			this.$modal.hide(`add-nav-col-${this.path}-modal`)
		},
		handleNavColDelete(index) {
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
		handleNavColDuplicate(index) {
			this.updateSectionByPath({
				path: this.path,
				value: index,
				duplicateArrayValue: true,
			})
		},
		getItemLabel(index) {
			const item = this.fieldContext.items[index]
			const label =
				item.title || item.description || `${this.label} ${index + 1}`
			return truncate(label.replace(/<\/?[^>]+(>|$)/g, ''))
		},
	},
}
</script>
