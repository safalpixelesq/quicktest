<template>
	<ValidationProvider
		v-slot="{ errors }"
		:rules="field.rules"
		:mode="field.mode || 'aggressive'"
	>
		<div>
			<div class="uk-flex uk-flex-between">
				<label
					v-if="field.label"
					class="uk-form-label"
					:for="field.name"
				>
					{{ field.label }}
				</label>

				<div>
					<button
						:class="
							htmlEditor
								? 'uk-button-secondary'
								: 'uk-button-default'
						"
						uk-tooltip="Use HTML editor"
						@click.prevent="htmlEditor = true"
					>
						HTML
					</button>
					<button
						:class="
							htmlEditor
								? 'uk-button-default'
								: 'uk-button-secondary'
						"
						uk-tooltip="Use plain text editor"
						@click.prevent="htmlEditor = false"
					>
						Text
					</button>
				</div>
			</div>
			<client-only v-if="htmlEditor">
				<quill-editor v-model="value" :options="editorOption" />
			</client-only>
			<textarea
				v-else
				v-model="value"
				type="textarea"
				:name="field.name"
				class="uk-textarea"
			>
			</textarea>
			<span class="uk-text-danger uk-text-small">
				{{ errors[0] }}
			</span>
		</div>
	</ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
	name: 'WizzyInput',
	components: {
		ValidationProvider,
	},
	props: {
		field: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			htmlEditor: false,
		}
	},
	computed: {
		value: {
			get() {
				return this.field.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},
		editorOption() {
			return {
				modules: {
					toolbar: this.htmlEditor && [
						['bold', 'italic', 'underline'],
						['blockquote', 'code-block'],
						[{ list: 'ordered' }, { list: 'bullet' }],
						[{ align: [] }],
						[{ color: [] }, { background: [] }],
						['link', 'image'],
						[{ header: [1, 2, 3, 4, 5, 6, false] }],
					],
				},
				matchVisual: false,
			}
		},
	},
	mounted() {
		if (this.field.defaultHtmlEditor) {
			this.htmlEditor = true
		}
	},
}
</script>
