<template>
	<div>
		<EditorHeader
			:page="page"
			:show-partials="true"
			:has-publish="true"
			:handle-save="handleSave"
			:exit-link="`/projects/${$route.params.slug}/pages`"
		>
			<div class="uk-flex uk-flex-middle uk-height-1-1">
				<div class="page-info uk-tile-muted uk-height-1-1">
					<span
						class="uk-text-success uk-margin-small-right"
						uk-icon="icon: file-edit; ratio: 1.5"
					></span>

					<span> Editing: {{ page.slug }} </span> <br />
				</div>

				<button
					class="uk-margin-left uk-button uk-button-text"
					@click="editSeoModalOpen = true"
				>
					SEO
				</button>
				<button
					class="uk-margin-left uk-button uk-button-text"
					@click="revisionModalOpen = true"
				>
					Revisions
				</button>
				<Modal
					v-if="page"
					:open="editSeoModalOpen"
					:close-handler="() => (editSeoModalOpen = false)"
				>
					<div class="uk-modal-body">
						<h2>Edit page SEO</h2>
						<FormContainer
							:fields="editSeoFields"
							:submit-handler="handleEditSeo"
							submit-label="Submit"
						/>
					</div>
				</Modal>

				<Modal
					v-if="page"
					:open="revisionModalOpen"
					:close-handler="() => (revisionModalOpen = false)"
				>
					<div class="uk-modal-body">
						<h2>Revisions</h2>
						<div
							v-for="(revision, index) in page.revisions"
							:key="revision.id"
						>
							<div
								v-if="index > 0"
								class="uk-padding-small uk-flex uk-flex-middle uk-flex-between"
							>
								<div>
									<span> Revision #{{ revision.id }} </span
									><br />
									<span
										v-if="revision.author"
										class="uk-text-meta"
									>
										{{ revision.author.username }} /
										{{
											new Date(
												revision.updated_at
											).toDateString()
										}}
									</span>
								</div>
								<button
									class="uk-icon-button"
									uk-icon="history"
									@click="revertToRevision(revision)"
								></button>
							</div>
						</div>

						<div
							v-if="page.revisions && page.revisions.length <= 1"
							class="uk-border uk-padding"
						>
							Revision not found.
						</div>
					</div>
				</Modal>
			</div>
		</EditorHeader>
		<div class="pqw-page-wrapper">
			<EditorWindow
				:has-global-header="globalHeader && globalHeader.isNotEmpty"
				:has-global-footer="globalFooter && globalFooter.isNotEmpty"
				:handle-save="handleSave"
			/>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import EditorHeader from '@/components/builder/EditorHeader'
import EditorWindow from '@/components/builder/EditorWindow'
import Modal from '@/components/Modal'
import FormContainer from '@/components/form/FormContainer'

export default {
	name: 'PageEditor',
	components: {
		Modal,
		FormContainer,
		EditorHeader,
		EditorWindow,
	},
	data() {
		return {
			editSeoModalOpen: false,
			revisionModalOpen: false,
		}
	},
	async fetch({ store, error, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
			await store.dispatch('pages/getCurrentPage', {
				page: params.pageid,
				project: params.slug,
			})
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	head() {
		return {
			title: this.page.meta.title,
			link: [
				{
					rel: 'stylesheet',
					type: 'text/css',
					href: this.page.cssPath,
				},
			],
		}
	},
	computed: {
		...mapState({
			project: (state) => state.projects.project,
			page: (state) => state.pages.page,
			activeRevision: (state) => state.pages.activeRevision,
			partials: (state) => state.partials.partials,
		}),
		...mapGetters({
			assetFolder: 'projects/assetFolder',
			globalHeader: 'partials/globalHeader',
			globalFooter: 'partials/globalFooter',
			modulesHandleMap: 'modules/modulesHandleMap',
		}),

		editSeoFields() {
			return [
				{
					name: 'title',
					label: 'Page Title',
					type: 'text',
					rules: 'required|min:2|max:256',
					defaultValue: this.page.meta.title,
				},
				{
					name: 'slug',
					label: 'Page Slug',
					type: 'text',
					rules: 'required|url',
					defaultValue: this.page.slug,
				},
				{
					name: 'description',
					label: 'Page Description',
					type: 'textarea',
					rules: 'max:500',
					defaultValue: this.page.meta.description,
				},
				{
					name: 'image',
					label: 'OG Image',
					type: 'image',
					rules: 'url',
					defaultValue: this.page.meta.image,
				},
				{
					name: 'json_ld',
					label: 'JSON-LD',
					type: 'text',
					defaultValue: this.page.meta.json_ld,
				},
				{
					name: 'index',
					label: 'Index this page in search engine.',
					type: 'checkbox',
					rules: 'required',
					defaultValue: !!this.page.meta.index,
				},
			]
		},
	},
	watch: {
		page() {
			this.setDefaultSections()
		},
		globalHeader() {
			this.setDefaultSections()
		},
		globalFooter() {
			this.setDefaultSections()
		},
	},
	mounted() {
		this.resetEditor()
		this.setDefaultSections()
	},
	methods: {
		...mapActions({
			getHTML: 'modules/getHTML',
			savePage: 'pages/savePage',
			updateMeta: 'pages/updateMeta',
			setSections: 'editors/setSections',
			resetEditor: 'editors/resetEditor',
			revertRevision: 'pages/revertRevision',
			setEditorDirty: 'editors/setEditorDirty',
		}),
		handleSave(sections, publishPage) {
			this.savePage({
				payload: {
					revision: {
						json_content: sections,
					},
					publishPage,
				},
				page: this.page.uuid,
				project: this.$route.params.slug,
			})
				.then(() => {
					this.$uikit.notification(
						`Successfully ${publishPage ? 'published' : 'saved'}!`,
						'success'
					)
				})
				.catch((error) => {
					console.log(error)
					this.$uikit.notification(
						'Something went wrong. Please try again later',
						'danger'
					)
				})
		},
		async setDefaultSections() {
			const content = this.activeRevision.json_content
			let sections = content ? [...content] : []
			let dirty = false

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
				if (this.globalHeader && this.globalHeader.isNotEmpty) {
					dirty = true
					sections.unshift(this.globalHeader.module)
				}
				if (this.globalFooter && this.globalFooter.isNotEmpty) {
					dirty = true
					sections.push(this.globalFooter.module)
				}
			} else {
				if (
					content[0].name !== 'global-header' &&
					content[0].group !== 'header' &&
					this.globalHeader &&
					this.globalHeader.isNotEmpty
				) {
					dirty = true
					sections.unshift(this.globalHeader.module)
				}
				if (
					content[content.length - 1].name !== 'global-footer' &&
					content[content.length - 1].group !== 'footer' &&
					this.globalFooter &&
					this.globalFooter.isNotEmpty
				) {
					dirty = true
					sections.push(this.globalFooter.module)
				}
			}

			this.setEditorDirty(dirty)
			this.setSections(sections)
		},

		handleEditSeo(data) {
			// update the meta
			this.savePage({
				payload: { meta: data },
				page: this.page.uuid,
				project: this.$route.params.slug,
			})
				.then(() => {
					this.editSeoModalOpen = false
				})
				.then(() => {
					this.$uikit.notification(
						'SEO fields successfully updated',
						'success'
					)
				})
				.catch((e) => {
					this.$uikit.notification('Something went wrong', 'danger')
				})
		},
		revertToRevision(revision) {
			this.$uikit.modal
				.confirm(
					'Your current changes will be reverted to the selected revision.'
				)
				.then(() =>
					this.revertRevision({
						revisionID: revision.id,
					})
				)
				.then(() => {
					this.$uikit.notification('Reverted successfully', 'success')
				})
		},
	},
}
</script>
<style lang="scss">
.page-info {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 5px 32px;
}
.revision-dropdown {
	height: 100%;
	border-left: 1px solid #999;
	border-right: 1px solid #999;
	background-color: #fff;
}
</style>
