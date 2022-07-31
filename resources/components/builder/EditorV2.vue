<template>
	<div class="editor-accordion-box">
		<component
			:is="`pq_${field}`"
			v-for="(field, i) in validFields"
			:key="`ef_${i}`"
			:field-name="field"
			:field-context="context[field] || getDefaultValue(field)"
			:parent-path="'context'"
			class="uk-margin"
		>
		</component>
		<FormContainer
			v-if="isAdmin"
			:fields="connectionField"
			:submit-handler="updateConnection"
			submit-label="Update Connections"
		/>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { startCase, toLower } from 'lodash'
import FormContainer from '@/components/form/FormContainer'

const editorFieldsMap = {
	FormContainer,
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
	field_textarea: () => import('@/components/form/TextareaInput'),
}
export default {
	name: 'EditEditorV2',
	components: {
		...editorFieldsMap,
	},
	computed: {
		...mapState({
			context: (state) =>
				typeof state.editors.activeSectionIndex === 'number' &&
				state.editors.activeSectionIndex >= 0
					? state.editors.sections[state.editors.activeSectionIndex]
							.context
					: {},

			connection: (state) =>
				state.editors.sections[state.editors.activeSectionIndex]
					.connection,
		}),
		validFields() {
			return Object.keys(this.context).filter(
				(field) => !!editorFieldsMap[`pq_${field}`]
			)
		},
		connectionField() {
			return [
				{
					type: 'textarea',
					label: 'Connections',
					name: 'connections',
					style: {
						height: '350px',
						fontSize: '13px',
					},
					defaultValue: JSON.stringify(
						this.connection || {},
						null,
						4
					),
				},
			]
		},
	},
	methods: {
		...mapActions({
			setConnectionOverwrite: 'editors/setConnectionOverwrite',
		}),
		...mapGetters(['isAdmin']),

		titleCase(str) {
			return startCase(toLower(str))
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
		updateConnection(data) {
			try {
				const connections = JSON.parse(data.connections)
				this.setConnectionOverwrite(connections)
			} catch (error) {
				console.log(error)
			}
		},
	},
}
</script>
<style lang="scss">
.editor-accordion-box {
	box-sizing: border-box;
	padding: 20px;
	width: 100%;
	height: 480px;
	overflow-y: auto;
	li {
		border: 0.5px solid #ddd;
	}

	.uk-accordion-title {
		font-size: 16px;
		background-color: rgb(247, 247, 247);
		padding: 8px;
		border-radius: 4px;
	}

	.uk-accordion-content {
		padding: 20px 10px;
		margin: 0;
	}

	.uk-input,
	.uk-form-label {
		font-size: 14px;
	}

	p {
		margin: 0;
	}

	.editor-button {
		outline: none;
		padding: 5px 10px;
		font-family: inherit;
		width: 100%;
		margin-right: 20px;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
