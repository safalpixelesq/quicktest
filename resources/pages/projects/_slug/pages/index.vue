<template>
	<div class="uk-margin-top">
		<div class="uk-grid" data-uk-grid>
			<div class="uk-width-1-1@m">
				<div class="uk-margin-top uk-grid" data-uk-grid>
					<div
						class="uk-flex uk-width-1-1 uk-flex-between uk-flex-middle"
					>
						<h2 class="uk-text-medium uk-margin-bottom">
							{{ project.name }}: Pages
						</h2>
						<div>
							<button
								class="uk-button uk-button-default uk-button-small btn"
								@click="createPageModalOpen = true"
							>
								&plus; Create New Page
							</button>
						</div>
					</div>
				</div>
			</div>

			<main class="uk-width-1-1 uk-margin-large-bottom">
				<client-only>
					<vue-good-table
						mode="remote"
						:columns="columns"
						:rows="rows"
						:total-rows="pages.total"
						:sort-options="{
							enabled: false,
						}"
						:search-options="{
							enabled: true,
							placeholder: 'Search pages',
						}"
						:pagination-options="{
							enabled: true,
							perPage: pages.perPage,
							perPageDropdownEnabled: false,
						}"
						style-class="vgt-table min-height"
						@on-page-change="onPageChange"
						@on-search="onSearch"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'title_col'">
								<span class="uk-text-medium">
									{{ props.formattedRow.title_col.title }}
								</span>
								<br />
								<span class="uk-text-meta">
									{{ props.formattedRow.title_col.slug }}
								</span>
							</span>
							<span
								v-else-if="props.column.field === 'status_col'"
							>
								<span
									v-if="
										props.formattedRow.status_col.published
									"
									class="uk-label uk-label-success"
									title="A version of this page is published."
								>
									LIVE
								</span>

								<span
									v-if="props.formattedRow.status_col.draft"
									class="uk-label uk-label-warning"
									title="A copy of this page is in draft status."
								>
									DRAFT
								</span>
							</span>
							<span
								v-else-if="props.column.field === 'action_col'"
							>
								<Actions
									:project="project"
									:page="props.formattedRow.action_col.page"
									@delete="
										deletePage(
											props.formattedRow.action_col.page
										)
									"
									@duplicate="
										showDuplicateModal(
											props.formattedRow.action_col.page
										)
									"
								/>
							</span>
							<span v-else>
								{{ props.formattedRow[props.column.field] }}
							</span>
						</template>
					</vue-good-table>
				</client-only>
			</main>
		</div>

		<Modal
			:open="createPageModalOpen"
			:close-handler="() => (createPageModalOpen = false)"
		>
			<div class="uk-modal-body">
				<h2>Create a new page</h2>
				<FormContainer
					:fields="createPageFields"
					:submit-handler="createNewPage"
					submit-label="Create"
				/>
			</div>
		</Modal>
		<Modal
			:open="duplicatePageModalOpen"
			:close-handler="() => (duplicatePageModalOpen = false)"
		>
			<div class="uk-modal-body">
				<h2>Duplicate page</h2>
				<FormContainer
					:fields="duplicatePageFields"
					:submit-handler="duplicatePage"
					submit-label="Create"
				/>
			</div>
		</Modal>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Modal from '@/components/Modal'
import Actions from '@/components/page/Actions'
import FormContainer from '@/components/form/FormContainer'
export default {
	name: 'Pages',
	components: {
		Modal,
		Actions,
		FormContainer,
	},
	layout: 'project',
	data() {
		return {
			createPageModalOpen: false,
			duplicatePageModalOpen: false,
			duplicatePageContext: {},
			columns: [
				{
					label: 'Title',
					field: 'title_col',
				},
				{
					label: 'Updated',
					field: 'updated_col',
					globalSearchDisabled: true,
				},
				{
					label: 'Author',
					field: 'author_col',
					globalSearchDisabled: true,
				},
				{
					label: 'Status',
					field: 'status_col',
					globalSearchDisabled: true,
				},
				{
					label: 'Actions',
					field: 'action_col',
					globalSearchDisabled: true,
				},
			],
		}
	},
	async fetch({ store, error, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	computed: {
		...mapState({
			project: (state) => state.projects.project,
			pages: (state) => state.pages.pages,
			themes: (state) => state.themes.themes,
		}),
		rows() {
			return this.pages.data.map((page) => ({
				title_col: { title: page.title, slug: page.slug },
				updated_col: new Date(page.updated_at).toDateString(),
				author_col: page.author.username,
				status_col: {
					published: !!page.publishedRevision[0],
					draft: !!page.draftRevision[0],
				},
				action_col: {
					page,
				},
			}))
		},
		createPageFields() {
			return [
				{
					name: 'title',
					label: 'Page Title',
					type: 'text',
					rules: 'required|min:2|max:256',
				},
				{
					name: 'slug',
					label: 'Page Slug',
					type: 'text',
					rules: `required|url|duplicate:${this.pages.data
						.map((p) => p.slug)
						.join(',')}`,
				},
				{
					name: 'description',
					label: 'Page Description',
					type: 'textarea',
					rules: 'max:500',
				},
				{
					name: 'theme',
					label: 'Page Theme (Optional)',
					type: 'select',
					options: this.themes.map((t) => ({
						label: t.name,
						value: t.id + '',
					})),
					// defaultValue: this.project.setting.theme_id || '',
				},
			]
		},
		duplicatePageFields() {
			return [
				{
					name: 'title',
					label: 'Page Title',
					type: 'text',
					rules: 'required|min:2|max:256',
					defaultValue: this.duplicatePageContext
						? `${this.duplicatePageContext.title} copy`
						: '',
				},
				{
					name: 'slug',
					label: 'Page Slug',
					type: 'text',
					rules: `required|url|duplicate:${this.pages.data
						.map((p) => p.slug)
						.join(',')}`,
				},
			]
		},
	},
	mounted() {
		this.fetchPages({
			project: this.$route.params.slug,
			pageNum: 1,
		})

		if (!this.themes || !this.themes.length) {
			this.fetchThemes(this.project.slug)
		}
	},
	methods: {
		...mapActions({
			fetchPages: 'pages/fetchPages',
			createPage: 'pages/createPage',
			deletePageAction: 'pages/deletePage',
			duplicatePageAction: 'pages/duplicatePage',
			fetchThemes: 'themes/fetchThemes',
		}),

		deletePage(page) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete the page ${page.title}?`,
					{ labels: { ok: 'Delete', cancel: 'Cancel' } }
				)
				.then(() =>
					this.deletePageAction({
						page: page.uuid,
						project: this.$route.params.slug,
					})
				)
				.then(() => {
					this.$uikit.notification(
						'Page successfully deleted',
						'success'
					)
				})
				.catch((error) => {
					console.log(error)
				})
		},

		async createNewPage(data) {
			try {
				const responseData = await this.createPage({
					project: this.$route.params.slug,
					payload: {
						page: { slug: data.slug, title: data.title },
						meta: {
							title: data.title,
							description: data.description,
						},
						...(data.theme && {
							theme: { id: data.theme },
						}),
					},
				})
				this.createPageModalOpen = false
				this.$router.push(
					`/projects/${this.project.slug}/pages/${responseData.data.uuid}/edit`
				)
			} catch (error) {
				console.log(error)
				this.createPageModalOpen = false
				this.$uikit.notification(
					'Something went wrong. Please try again later',
					'danger'
				)
			}
		},

		showDuplicateModal(page) {
			this.duplicatePageContext = page
			this.duplicatePageModalOpen = true
		},

		async duplicatePage(data) {
			const responseData = await this.duplicatePageAction({
				page: this.duplicatePageContext.uuid,
				project: this.$route.params.slug,
				payload: {
					slug: data.slug,
					title: data.title,
				},
			})
			this.duplicatePageModalOpen = false
			this.$router.push(
				`/projects/${this.project.slug}/pages/${responseData.data.uuid}/edit`
			)
		},

		onPageChange(params) {
			this.fetchPages({
				project: this.$route.params.slug,
				pageNum: params.currentPage,
			})
		},

		onSearch(params) {
			clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				this.fetchPages({
					project: this.$route.params.slug,
					pageNum: params.currentPage,
					search: params.searchTerm,
				})
			}, 500)
		},
	},
}
</script>

<style lang="scss">
.uk-label {
	font-size: 10px;
	font-weight: 500;
	letter-spacing: 1px;
}

.min-height {
	min-height: 300px;
}
</style>
