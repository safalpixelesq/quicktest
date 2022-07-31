<template>
	<div>
		<ValidationObserver v-slot="{ handleSubmit, reset }">
			<form
				class="uk-grid uk-grid-small"
				@submit.prevent="handleSubmit(onSubmit)"
				@reset.prevent="reset"
			>
				<div
					v-for="field in orderedFields"
					:key="field.name"
					:class="field.halfWidth ? 'uk-width-1-2' : 'uk-width-1-1'"
				>
					<div class="uk-margin-bottom">
						<div v-if="field.type === 'block'">
							<label class="uk-form-label" :for="field.name">
								{{ field.label }}
							</label>
							<FormContainer
								:fields="field.fields"
								:sub-form-key="field.name"
								class="uk-padding-small"
								style="border: 1px solid #ccc"
								@update="handleSubFormUpdate"
							/>
							<button
								v-if="field.isList"
								class="
									uk-button
									uk-button-default
									uk-width-1-1
									uk-margin
								"
								@click.prevent="addField(field.name)"
							>
								Add item
							</button>
						</div>
						<component
							:is="`field_${field.type}`"
							v-else
							:field="field"
							@input="handleInput($event, field.name)"
						/>
					</div>
				</div>
				<slot name="before-submit-btn"></slot>
				<div v-if="submitHandler" class="uk-width-1-1 uk-margin-bottom">
					<button
						class="uk-button uk-button-primary uk-width-1-1"
						:class="submitButtonClass"
						:disabled="loading"
						type="submit"
					>
						<span v-if="loading" uk-spinner="ratio: 0.8"></span>
						<span v-else>
							{{ submitLabel }}
						</span>
					</button>
				</div>
			</form>
		</ValidationObserver>
	</div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import { set } from 'lodash'
import { titleCase } from '@/services/CommonUtils'

export default {
	name: 'FormContainer',
	components: {
		ValidationObserver,
		field_text: () => import('@/components/form/DefaultInput'),
		field_number: () => import('@/components/form/DefaultInput'),
		field_select: () => import('@/components/form/SelectInput'),
		field_font: () => import('@/components/form/FontInput'),
		field_color: () => import('@/components/form/ColorInput'),
		field_image: () => import('@/components/form/ImageInput'),
		field_html: () => import('@/components/form/WizzyInput'),
		field_checkbox: () => import('@/components/form/CheckboxInput'),
		field_textarea: () => import('@/components/form/TextareaInput'),
	},
	props: {
		fields: {
			type: Array,
			default: () => [],
		},
		submitLabel: {
			type: String,
			default: '',
		},
		submitHandler: {
			type: Function,
			default: null,
		},
		submitButtonClass: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		subFormKey: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			form: {},
		}
	},
	computed: {
		orderedFields() {
			return Object.values(this.form).sort((a, b) => a.order - b.order)
		},
	},
	watch: {
		fields() {
			this.setFormState()
		},
	},
	mounted() {
		this.setFormState()
	},
	methods: {
		onSubmit() {
			this.submitHandler(
				Object.values(this.form).reduce((acc, curr) => {
					return {
						...acc,
						[curr.name]: curr.value,
					}
				}, {})
			)
		},

		handleInput(value, field) {
			const fieldState = this.form[field]
			this.form = {
				...this.form,
				[field]: {
					...fieldState,
					value,
				},
			}
			// if deep form, send update to parent
			if (this.subFormKey) {
				this.$emit('update', {
					formData: this.form,
					formKey: this.subFormKey,
				})
			}

			if (fieldState.onChangeCb) {
				fieldState.onChangeCb(value)
			}
		},
		handleSubFormUpdate(data) {
			Object.entries(data.formData).forEach(([key, fieldValue]) => {
				set(
					this.form,
					`${data.formKey}['value']${key}`,
					fieldValue.value
				)
			})
		},
		addField(fieldName) {
			const field = this.form[fieldName]
			const sampleField = field.fields[0]
			const newFieldIndex = field.fields.length

			const newField = {
				...sampleField,
				name: `[${newFieldIndex}]${
					sampleField.addOriginalNameOnNewField
						? `[${sampleField.originalName}]`
						: ''
				}`,
				...(!sampleField.addOriginalNameOnNewField && {
					label: titleCase(
						`${sampleField.parentName} ${
							parseInt(newFieldIndex) + 1
						}`
					),
				}),
			}
			delete newField.value
			delete newField.defaultValue

			field.fields.splice(newFieldIndex, 0, newField)
		},
		setFormState() {
			Object.keys(this.form).forEach((fieldKey) => {
				if (!this.fields.some((f) => f.name === fieldKey)) {
					delete this.form[fieldKey]
				}
			})

			this.fields.forEach((item, index) => {
				this.form = {
					...this.form,
					[item.name]: {
						...this.form[item.name],
						...item,
						order: index,
						...(item.defaultValue && {
							value: this.form[item.name]
								? this.form[item.name].value
								: item.defaultValue,
						}),
					},
				}
			})
		},
	},
}
</script>
