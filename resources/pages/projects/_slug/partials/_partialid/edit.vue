<template>
	<div>
		<EditorHeader
			:has-publish="true"
			:handle-save="handleSave"
			:exit-link="`/projects/${$route.params.slug}/partials`"
		>
			<div class="partial-info uk-tile-muted">
				<span class="uk-text-small">Partial: {{ partial.name }}</span>
				<br />
				<span
					v-if="partial.author && partial.author.username"
					class="uk-text-meta"
				>
					Last saved by {{ partial.author.username }} on
					{{ new Date(partial.updated_at).toDateString() }}
				</span>
				<br />
			</div>
		</EditorHeader>
		<div class="pqw-page-wrapper">
			<EditorWindow />
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import EditorHeader from '@/components/builder/EditorHeader'
import EditorWindow from '@/components/builder/EditorWindow'

export default {
	name: 'PartialEditor',
	components: {
		EditorHeader,
		EditorWindow,
	},
	async fetch({ store, error, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
			await store.dispatch('partials/getPartial', params.partialid)
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	computed: {
		...mapState({
			partial: (state) => state.partials.partial,
		}),
		...mapGetters({
			modulesHandleMap: 'modules/modulesHandleMap',
		}),
	},
	mounted() {
		this.resetEditor()
		this.setDefaultSections()
	},
	methods: {
		...mapActions({
			savePartial: 'partials/savePartial',
			setSections: 'editors/setSections',
			resetEditor: 'editors/resetEditor',
		}),
		handleSave(sections) {
			return this.savePartial({
				partialData: {
					json_content: sections,
				},
			}).then(() => {
				this.$uikit.notification('Successfully saved', 'success')
			})
		},
		async setDefaultSections() {
			const content = this.partial.json_content
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
	},
}
</script>
<style lang="scss" scoped>
.partial-info {
	padding: 5px 32px;
}
</style>
