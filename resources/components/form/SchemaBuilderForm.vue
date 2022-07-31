<template>
	<div class="uk-background-muted uk-padding-small uk-margin">
		<div class="uk-margin">
			<h4>Schema</h4>
			<div>
				<button
					class="uk-button uk-button-small uk-button-default"
					@click="addForm($event, 'reference')"
				>
					Add refernce
				</button>
				<button
					class="uk-button uk-button-small uk-button-default"
					@click="addForm($event, 'block')"
				>
					Add block
				</button>
				<button
					class="uk-button uk-button-small uk-button-default"
					@click="addForm"
				>
					Add field
				</button>
			</div>
		</div>
		<div class="coll-fields-accordion-box">
			<ul class="uk-accordion" uk-accordion>
				<li
					v-for="(key, i) in Object.keys(forms)"
					:key="`form_${key}`"
					:class="{ 'uk-open': openForm === i }"
				>
					<a href="#" class="uk-accordion-title">
						{{ forms[key].title }}
					</a>
					<div class="uk-accordion-content">
						<FormContainer
							:fields="forms[key].fields"
							submit-button-class="uk-button-secondary"
							:submit-handler="
								(data) => {
									handleSubmit(data, key, forms[key].formType)
								}
							"
							submit-label="Save"
						>
							<template #before-submit-btn>
								<div
									v-if="
										forms[key] &&
										forms[key].formType === 'block'
									"
									class="uk-width-1-1 uk-margin-bottom"
								>
									<button
										class="uk-button uk-width-1-1"
										@click="addBlockField(key)"
									>
										Add field
									</button>
								</div>
							</template>
						</FormContainer>
						<button
							class="uk-button uk-button-danger uk-width-1-1"
							@click="deleteField(key)"
						>
							Delete
						</button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import FormContainer from '@/components/form/FormContainer'
import { titleCase } from '@/services/CommonUtils'
import { cloneDeep } from 'lodash'

export default {
	name: 'SchemaBuilderForm',
	components: {
		FormContainer,
	},
	props: {
		collection: {
			type: Object,
			default: () => ({}),
		},
		fieldSchema: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			openForm: -1,
			forms: {},
		}
	},
	computed: {
		...mapState({
			collections: (state) => state.collections.collections,
		}),
		fieldTypes() {
			return [
				{
					label: 'Text',
					value: 'text',
				},
				{
					label: 'HTML',
					value: 'html',
				},
				{
					label: 'Media',
					value: 'image',
				},
				{
					label: 'Checkbox',
					value: 'checkbox',
				},
				{
					label: 'Custom',
					value: 'custom',
				},
			]
		},
		referenceList() {
			return this.collections
				.filter((c) => c.slug !== this.collection.slug)
				.map((c) => ({
					label: c.name,
					value: `$pq_reference_${c.slug}`,
				}))
		},
	},
	watch: {
		fieldSchema() {
			this.setExistingFieldForm()
		},
	},
	mounted() {
		this.fetchCollections(this.$route.params.slug).then(() => {
			this.setExistingFieldForm()
		})
	},
	methods: {
		...mapActions({
			fetchCollections: 'collections/fetchCollections',
		}),
		setExistingFieldForm() {
			if (this.fieldSchema) {
				const forms = {}
				Object.entries(this.fieldSchema).forEach(([key, value]) => {
					forms[key] = {
						title: titleCase(key),
						fields:
							value.formType === 'block'
								? this.parseBlockSchemaFields(key, value)
								: [
										...this.getSchemaFields(
											{
												name: key,
												fieldValue: key,
												typeValue: value.type,
											},
											value.formType
										),
										...this.getCheckboxFields(
											key,
											value.isList,
											value.formType
										),
								  ],
						formType: value.formType,
					}
				})

				this.forms = forms
			}
		},
		addForm(e, formType) {
			const nextFormIndex = Object.keys(this.forms).length
			const newFieldName = `field_${nextFormIndex + 1}`
			let fields = []
			if (formType === 'block') {
				fields = [
					this.getTextField(newFieldName),
					...this.getSchemaFields(
						{
							name: `${newFieldName}_subfield_1`,
						},
						formType
					),
				]
			} else {
				fields = this.getSchemaFields(
					{
						name: newFieldName,
					},
					formType
				)
			}

			fields = [
				...fields,
				...this.getCheckboxFields(newFieldName, false, formType),
			]

			this.$set(this.forms, newFieldName, {
				title: newFieldName,
				formType,
				fields,
			})
			this.openForm = nextFormIndex
		},

		addBlockField(formName) {
			const blockForm = this.forms[formName]
			const newFieldName = `${formName}_subfield_${Math.ceil(
				blockForm.fields.length / 2
			)}`

			const newFields = this.getSchemaFields({
				name: newFieldName,
			})

			blockForm.fields.splice(
				blockForm.fields.length - 1,
				0,
				newFields[0],
				newFields[1]
			)
		},
		getSchemaFields({ name, fieldValue, typeValue }, formType) {
			return [
				{
					name,
					label: 'Name',
					type: 'text',
					rules: 'required|min:2|max:256',
					halfWidth: true,
					...(fieldValue && { defaultValue: fieldValue }),
				},
				{
					...(formType === 'reference'
						? {
								name: `${name}_type`,
								label: 'Reference',
								type: 'select',
								rules: 'required',
								halfWidth: true,
								options: this.referenceList,
								...(typeValue && { defaultValue: typeValue }),
						  }
						: {
								name: `${name}_type`,
								label: 'Type',
								type: 'select',
								rules: 'required',
								halfWidth: true,
								options: this.fieldTypes,
								defaultValue: typeValue || 'text',
						  }),
				},
			]
		},

		getTextField(name, fieldValue) {
			return {
				name,
				label: 'Block Name',
				type: 'text',
				rules: 'required|min:2|max:256',
				...(fieldValue && { defaultValue: fieldValue }),
			}
		},

		getCheckboxFields(name, listValue, formType) {
			const fields = [
				{
					name: `${name}_isList`,
					label: 'Field is a list',
					type: 'checkbox',
					defaultValue: listValue || false,
				},
			]

			return fields
		},

		parseBlockSchemaFields(blockKey, blockSchema) {
			const result = Object.entries(blockSchema.type).map(
				([key, value], i) =>
					this.getSchemaFields({
						name: `${blockKey}_subfield_${i + 1}`,
						fieldValue: key,
						typeValue: value,
					})
			)
			result.unshift(this.getTextField(blockKey, blockKey))
			result.push(
				this.getCheckboxFields(blockKey, blockSchema.isList, 'block')
			)

			return result.flat()
		},
		handleSubmit(data, fieldName, formType) {
			// extract standard data

			const schemaCopy = cloneDeep(this.fieldSchema)
			let value
			if (formType === 'block') {
				value = {}
				const fieldsCount = Math.ceil(Object.keys(data).length / 2)
				for (let i = 1; i < fieldsCount; i++) {
					value[data[`${fieldName}_subfield_${i}`]] =
						data[`${fieldName}_subfield_${i}_type`]
				}
			} else {
				value = data[`${fieldName}_type`]
			}

			const updatedSchema = {
				...schemaCopy,
				...{
					[data[fieldName]]: {
						type: value,
						formType,
						isList: !!data[`${fieldName}_isList`],
					},
				},
			}

			this.$emit('save-schema', updatedSchema)
			this.openForm = -1
		},
		deleteField(fieldName) {
			const schemaCopy = cloneDeep(this.fieldSchema)

			delete schemaCopy[fieldName]
			this.$emit('save-schema', schemaCopy)
		},
	},
}
</script>
