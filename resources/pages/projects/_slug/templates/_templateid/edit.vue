<template>
	<div>
		<EditorHeader
			:has-publish="false"
			:handle-save="handleSave"
			:exit-link="`/projects/${$route.params.slug}/templates`"
		>
			<div style="padding: 5px 32px" class="uk-tile-muted">
				<span class="uk-text-small">Template: {{ template.name }}</span>
				<br />
				<span
					v-if="template.author && template.author.username"
					class="uk-text-meta"
				>
					Last saved by {{ template.author.username }} on
					{{ new Date(template.updated_at).toDateString() }}
				</span>
				<br />
			</div>
		</EditorHeader>
		<div class="pqw-template-wrapper">
			<EditorWindow />
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import EditorHeader from '@/components/builder/EditorHeader'
import EditorWindow from '@/components/builder/EditorWindow'

export default {
	name: 'TemplateEditor',
	components: {
		EditorHeader,
		EditorWindow,
	},
	async fetch({ store, error, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
			await store.dispatch('templates/getTemplate', {
				project: params.slug,
				template: params.templateid,
			})
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	computed: {
		...mapState({
			template: (state) => state.templates.template,
		}),
		...mapGetters({
			modulesHandleMap: 'modules/modulesHandleMap',
		}),
	},
	mounted() {
		this.resetEditor()
		this.setDefaultSections()
		if (this.template.collection) {
			this.getSampleEntry({
				collection: this.template.collection.slug,
				project: this.$route.params.slug,
			}).then((data) => {
				this.setSchemaConnection(data)
			})
		}
	},
	methods: {
		...mapActions({
			saveTemplate: 'templates/saveTemplate',
			setSections: 'editors/setSections',
			resetEditor: 'editors/resetEditor',
			getSampleEntry: 'entries/getSampleEntry',
			setConnector: 'editors/setConnector',
		}),
		handleSave(sections) {
			this.$uikit.modal
				.confirm(
					'Would you like to update pages associated with this template?',
					{
						labels: { ok: 'Update', cancel: 'Exit' },
					}
				)
				.then(() => {
					console.log('first')
					this.handleSaveTemplate(sections, true)
				})
				.catch((e) => {
					console.log('second')
					this.handleSaveTemplate(sections, false)
				})
		},
		handleSaveTemplate(sections, updatePages) {
			return this.saveTemplate({
				templateData: {
					json_content: sections,
				},
				template: this.template.uuid,
				project: this.$route.params.slug,
				updatePages,
			})
				.then(() => {
					this.$uikit.notification('Successfully saved', 'success')
				})
				.catch((error) => {
					console.log(error)
					this.$uikit.notification('Something went wrong', 'danger')
				})
		},
		async setDefaultSections() {
			const content = this.template.json_content
			let sections = content ? [...content] : []

			for (const index in sections) {
				const section = sections[index]
				if (!section.handle) {
					const mappedModule = Object.assign(
						{},
						this.modulesHandleMap[section.context.module],
						section
					)

					if (mappedModule.handle && !section.htmlstr) {
						mappedModule.htmlstr = await this.getHTML({
							handle: mappedModule.handle,
							reqData: {
								meta: { apimode: 'component' },
								content: [mappedModule.context],
							},
						})
					}
					sections[index] = mappedModule
				}
			}

			if (!content || content.length <= 0) {
				sections = [{ isDragHint: true, uid: 'drag-hint' }]
			}

			this.setSections(sections)
		},
		setSchemaConnection(entrySample) {
			const schema = Object.assign(
				{},
				this.template.collection.field_schema,
				entrySample.json_content
			)

			this.setConnector(schema)
		},
	},
}
</script>
