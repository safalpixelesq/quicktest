<template>
	<div>
		<div uk-sticky="sel-target: #editor-nav; cls-active: uk-navbar-sticky">
			<div
				class="uk-flex uk-flex-between uk-padding-small uk-background-muted"
			>
				<h3 class="uk-margin-remove">
					<nuxt-link :to="`/projects/${project.slug}/collections`">
						Collections
					</nuxt-link>
					/
					{{ collectionName }}
				</h3>
				<div>
					<button
						class="uk-button uk-button-medium uk-button-danger"
						@click="deleteConfirm('collection')"
					>
						Delete
					</button>
					<button
						v-if="fieldSchema"
						class="uk-button uk-button-medium uk-button-secondary"
						@click="$modal.show('create-entry-modal')"
					>
						&plus; New {{ collectionName }}
					</button>
				</div>
			</div>
		</div>

		<div class="uk-flex">
			<div class="uk-width-1-1 uk-padding-small">
				<client-only>
					<vue-good-table
						mode="remote"
						:columns="columns"
						:rows="rows"
						:total-rows="entries.total"
						:sort-options="{
							enabled: false,
						}"
						:search-options="{
							enabled: true,
							placeholder: 'Search entries',
						}"
						:pagination-options="{
							enabled: true,
							perPage: entries.perPage,
							perPageDropdownEnabled: false,
						}"
						style-class="vgt-table"
						@on-page-change="onPageChange"
						@on-search="onSearch"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'action_col'">
								<nuxt-link
									:to="`/projects/${project.slug}/collections/${collection.slug}/${props.formattedRow.action_col.entry.uuid}/edit`"
									class="uk-margin-right"
								>
									Edit
								</nuxt-link>
								<a
									v-if="
										props.formattedRow.action_col.entry.page
									"
									:href="`${apiUrl}/api/page/preview?id=${props.formattedRow.action_col.entry.page.uuid}&draft=true`"
									target="_blank"
									class="uk-margin-right"
								>
									Preview
								</a>
								<button
									class="uk-button uk-button-text uk-text-danger"
									@click="
										deleteConfirm(
											'entry',
											props.formattedRow.action_col.entry
										)
									"
								>
									Delete
								</button>
							</span>
							<span v-else>
								{{ props.formattedRow[props.column.field] }}
							</span>
						</template>
					</vue-good-table>
				</client-only>
			</div>
			<div
				style="width: 540px"
				class="uk-padding-small"
				uk-height-viewport="expand: true"
			>
				<SchemaBuilderForm
					:collection="collection"
					:field-schema="fieldSchema"
					@save-schema="handleSaveSchema"
				/>
				<div
					v-if="collection.has_pages"
					class="uk-background-muted uk-padding-small uk-margin"
				>
					<h4 class="uk-margin">Template</h4>
					<div v-if="collection.template">
						<h5 class="uk-margin-remove uk-text-bold">
							{{ collection.template.name }}
						</h5>
						<p class="uk-text-meta uk-margin-remove-top">
							Last edited:
							{{
								new Date(
									collection.template.updated_at
								).toDateString()
							}}
						</p>

						<nuxt-link
							:to="`/projects/${project.slug}/templates/${collection.template.uuid}/edit`"
							style="border: 1px solid var(--pw-tertiary)"
							class="uk-button uk-button-small uk-button-default"
						>
							Edit
						</nuxt-link>
						<nuxt-link
							:to="`/projects/${project.slug}/templates/${collection.template.uuid}/preview`"
							class="uk-margin-small-left uk-text-small"
						>
							Preview
						</nuxt-link>
					</div>
					<button
						v-if="!collection.template && entries.data.length"
						class="uk-button uk-width-1-1 uk-button-secondary"
						@click="createNewTemplate"
					>
						Create template
					</button>
				</div>
			</div>
		</div>

		<vue-modal
			name="create-entry-modal"
			height="auto"
			:width="400"
			:scrollable="true"
		>
			<div class="uk-modal-body">
				<h4>Create new entry</h4>
				<FormContainer
					:fields="createEntryFields"
					:submit-handler="createNewEntry"
					submit-label="Create"
				/>
			</div>
		</vue-modal>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { titleCase } from '@/services/CommonUtils'
import FormContainer from '@/components/form/FormContainer'
import SchemaBuilderForm from '@/components/form/SchemaBuilderForm'

export default {
	name: 'CollectionItem',
	components: {
		FormContainer,
		SchemaBuilderForm,
	},
	data() {
		return {
			fieldForms: {},
			columns: [
				{
					label: 'Label',
					field: 'label_col',
					width: '40%',
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
			await store.dispatch('collections/getCollection', {
				collection: params.collection,
				project: params.slug,
			})
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	computed: {
		...mapState({
			themes: (state) => state.themes.themes,
			project: (state) => state.projects.project,
			collection: (state) => state.collections.collection,
			entries: (state) => state.entries.entries,
		}),
		apiUrl() {
			return process.env.API_URL
		},
		collectionName() {
			return this.titleCase(this.collection.name)
		},
		fieldSchema() {
			return this.collection.field_schema
		},
		rows() {
			return this.entries.data.map((entry) => ({
				label_col: entry.label,
				updated_col: new Date(entry.updated_at).toDateString(),
				author_col:
					entry.author && this.titleCase(entry.author.username),
				action_col: {
					entry,
				},
			}))
		},
		createEntryFields() {
			let fields = [
				{
					name: 'label',
					label: `${this.collectionName} Label`,
					type: 'text',
					rules: 'required|min:2|max:256',
				},
			]
			if (this.collection.has_pages)
				fields = [
					...fields,
					{
						name: 'slug',
						label: `${this.collectionName} Slug`,
						type: 'text',
						mode: 'lazy',
						rules: {
							required: true,
							min: 2,
							max: 256,
							noSlash: true,
							beValidation: {
								validatorFunc: this.checkIfUniqueSlug,
								valueTransformer: (v) =>
									`${this.collection.slug}/${v}`,
								msg: 'Slug is already in use',
							},
						},
					},
					{
						name: 'theme',
						label: `${this.collectionName} Theme`,
						type: 'select',
						options: this.themes.map((t) => ({
							label: t.name,
							value: t.id + '',
						})),
						defaultValue: this.project.setting.theme_id || '',
					},
				]

			return fields
		},
	},
	mounted() {
		if (!this.themes || !this.themes.length) {
			this.fetchThemes(this.project.slug)
		}

		this.fetchEntries({
			collection: this.$route.params.collection,
			project: this.$route.params.slug,
			pageNum: 1,
		})
			.then(({ data }) => {
				this.setEntries(data)
			})
			.catch((e) => console.log(e))
	},
	methods: {
		...mapActions({
			fetchThemes: 'themes/fetchThemes',
			saveCollection: 'collections/saveCollection',
			fetchEntries: 'entries/fetchEntries',
			setEntries: 'entries/setEntries',
			createEntry: 'entries/createEntry',
			createTemplate: 'templates/createTemplate',
			deleteCollectionAction: 'collections/deleteCollection',
			deleteEntryAction: 'entries/deleteEntry',
		}),
		titleCase,
		onPageChange(params) {
			this.fetchEntries({
				collection: this.$route.params.collection,
				project: this.$route.params.slug,
				pageNum: params.currentPage,
			})
				.then(({ data }) => {
					this.setEntries(data)
				})
				.catch((e) => console.log(e))
		},

		onSearch(params) {
			clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				this.fetchEntries({
					collection: this.$route.params.collection,
					project: this.$route.params.slug,
					pageNum: params.currentPage,
					search: params.searchTerm,
				})
					.then(({ data }) => {
						this.setEntries(data)
					})
					.catch((e) => console.log(e))
			}, 500)
		},
		async createNewTemplate() {
			const responseData = await this.createTemplate({
				templateData: {
					name: `${this.collectionName} Template`,
					json_content: '',
				},
				collectionId: this.collection.id,
				project: this.$route.params.slug,
			})
			this.$router.push(
				`/projects/${this.project.slug}/templates/${responseData.data.uuid}/edit`
			)
		},
		deleteConfirm(type, entry) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete - ${
						type === 'collection'
							? this.collection.name
							: entry.label
					}?`,
					{ labels: { ok: 'Delete', cancel: 'Cancel' } }
				)
				.then(() => {
					if (type === 'collection') {
						this.deleteCollectionAction({
							collection: this.collection.slug,
							project: this.$route.params.slug,
						})
					} else {
						this.deleteEntryAction({
							collection: this.$route.params.collection,
							project: this.$route.params.slug,
							entry: entry.uuid,
						})
					}
				})
		},
		async createNewEntry(data) {
			const entry = await this.createEntry({
				payload: {
					entryData: { label: data.label },
					pageData: {
						slug: `/${this.collection.slug}/${data.slug}`,
						title: data.label,
					},
					metaData: {
						title: data.label,
					},
					themeData: {
						id: data.theme,
					},
				},
				collection: this.$route.params.collection,
				project: this.$route.params.slug,
			})

			if (entry) {
				this.$router.push(
					`/projects/${this.project.slug}/collections/${this.collection.slug}/${entry.uuid}/edit`
				)
			} else {
				this.$uikit.notification(
					'Something went wrong. Please try again later',
					'danger'
				)
			}
		},

		// handleAddEntry() {
		// 	if (this.collection.has_pages) {
		// 		this.$modal.show('create-entry-modal')
		// 	} else {
		// 		// create default entry
		// 		this.createNewEntry({})
		// 	}
		// },

		handleSaveSchema(updatedSchema) {
			this.saveCollection({
				collectionData: {
					field_schema: updatedSchema,
				},
				collection: this.collection.slug,
				project: this.$route.params.slug,
			})
		},

		checkIfUniqueSlug(value) {
			return this.$axios
				.get(
					`/api/${this.project.slug}/page/form/validation?value=${value}&type=unique-slug`
				)
				.then(({ data }) => !!data.data)
				.catch((err) => {
					console.log(err)
					return false
				})
		},
	},
}
</script>
<style lang="scss">
.coll-fields-accordion-box {
	box-sizing: border-box;
	width: 100%;
	li {
		border: 0.5px solid #ddd;
	}

	.uk-accordion-title {
		font-size: 18px;
		background-color: rgb(247, 247, 247);
		padding: 8px;
		border-radius: 4px;
	}

	.uk-accordion-content {
		padding: 20px;
		background-color: #fff;
		margin: 0;
	}
}
</style>
