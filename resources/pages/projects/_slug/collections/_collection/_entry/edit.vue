<template>
	<div id="entry-editor">
		<div uk-sticky="sel-target: #editor-nav; cls-active: uk-navbar-sticky">
			<nav id="editor-nav" class="uk-navbar-container uk-flex" uk-navbar>
				<div class="uk-navbar-left">
					<div class="uk-padding-small uk-tile-muted">
						<span class="uk-text-bold">
							{{ collectionName }}: {{ entry.label }}
						</span>
						<br />
						<span
							v-if="entry.author && entry.author.username"
							class="uk-text-meta"
						>
							Last saved by {{ entry.author.username }} on
							{{ new Date(entry.updated_at).toDateString() }}
						</span>
						<br />
					</div>
				</div>

				<div class="uk-navbar-right">
					<div class="uk-padding-small">
						<button
							v-if="entry.page"
							class="uk-button uk-button-secondary uk-button-small"
							@click="publishEntry"
						>
							Publish
						</button>
					</div>
					<div
						class="exit-icon uk-flex uk-flex-center uk-flex-middle"
						@click="exitEditor"
					>
						<span uk-icon="icon: sign-out; ratio: 2"> </span>
					</div>
				</div>
			</nav>
		</div>
		<div class="uk-container">
			<div class="uk-width-4-5 uk-padding uk-margin-auto">
				<FormContainer
					:fields="editEntryContentFields"
					submit-button-class="uk-button-secondary"
					:submit-handler="handleSubmit"
					submit-label="Save"
				/>
			</div>
			<FormContainer
				v-if="isAdmin"
				:fields="entryJsonField"
				:submit-handler="saveEntryJson"
				submit-label="Save JSON"
			/>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { set, flattenDeep, isObject, cloneDeep } from 'lodash'
import { titleCase } from '@/services/CommonUtils'
import FormContainer from '@/components/form/FormContainer'

export default {
	name: 'EditCollectionItem',
	components: {
		FormContainer,
	},
	data() {
		return {
			editEntryContentFields: [],
			entryReferences: {},
		}
	},
	async fetch({ store, error, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
			await store.dispatch('collections/getCollection', {
				collection: params.collection,
				project: params.slug,
			})
			await store.dispatch('entries/getEntry', {
				entry: params.entry,
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
			project: (state) => state.projects.project,
			collection: (state) => state.collections.collection,
			entry: (state) => state.entries.entry,
		}),
		...mapGetters(['isAdmin']),
		fieldSchema() {
			return this.collection.field_schema
		},
		entryContent() {
			return this.entry.json_content || {}
		},
		collectionName() {
			return titleCase(this.collection.name)
		},
		entryJsonField() {
			return [
				{
					type: 'textarea',
					label: 'Entry JSON',
					name: 'entry_json',
					style: {
						height: '850px',
						fontSize: '13px',
					},
					defaultValue: JSON.stringify(
						this.entryContent || {},
						null,
						4
					),
				},
			]
		},
	},

	watch: {
		entryReferences() {
			this.setFormFields()
		},
	},

	mounted() {
		this.setFormFields()
		this.pullReferencedEntries()
	},
	methods: {
		...mapActions({
			saveEntry: 'entries/saveEntry',
			fetchEntries: 'entries/fetchEntries',
			savePage: 'pages/savePage',
		}),
		titleCase,
		async handleSubmit(data) {
			const entry = await this.saveEntry({
				payload: {
					entryData: {
						label: data.$pq_label,
						json_content: Object.keys(this.fieldSchema).reduce(
							(acc, curr) => ({
								...acc,
								[curr]: data[curr],
							}),
							{}
						),
					},
				},
				collection: this.$route.params.collection,
				project: this.$route.params.slug,
				entry: this.entry.uuid,
			})

			if (entry) {
				this.$uikit.notification('Entry saved successfully', 'success')
				this.$router.push(
					`/projects/${this.$route.params.slug}/collections/${this.$route.params.collection}/`
				)
			} else {
				this.$uikit.notification(
					'Something went wrong. Please try again later',
					'danger'
				)
			}
		},
		setFormFields() {
			this.editEntryContentFields.splice(
				0,
				this.editEntryContentFields.length,
				...[
					{
						name: '$pq_label',
						label: `${this.collectionName} Label`,
						type: 'text',
						rules: 'required|min:2|max:256',
						defaultValue: this.entry.label || '',
					},
					...this.getFields(this.fieldSchema, this.entryContent),
				]
			)
		},
		getFields(fSchema, entryContent, options = {}) {
			const { parentName, parentIsList, listItemIsObject } = options
			const schemas = Array.from(
				Array(parentIsList && entryContent ? entryContent.length : 1)
			)

			const result = schemas.map((item, index) => {
				return Object.entries(fSchema).map(([key, value]) => {
					if (value.formType === 'block' || value.isList) {
						const blockField = {
							name: key,
							label: titleCase(key),
							type: 'block',
							isList: value.isList,
							fields: this.getFields(
								isObject(value.type)
									? value.type
									: [value.type],
								entryContent[key],
								{
									parentName: key,
									parentIsList: value.isList,
									parentIsBlock: value.formType === 'block',
									listItemIsObject: isObject(value.type),
								}
							),
						}

						blockField.fields.forEach((f) => {
							if (f.defaultValue)
								set(
									blockField,
									`defaultValue`,
									cloneDeep(entryContent[key])
								)
							// set(
							// 	blockField,
							// 	`defaultValue["${f.name}"]`,
							// 	f.defaultValue
							// )
						})
						return blockField
					} else {
						const isReference =
							(typeof value === 'string' &&
								value.startsWith('$pq_reference')) ||
							(value.type &&
								value.type.startsWith('$pq_reference'))
						const type = isReference
							? 'select'
							: value.type || value

						return {
							name: parentIsList
								? `[${index}]${
										listItemIsObject ? `[${key}]` : ''
								  }`
								: key,
							label: titleCase(
								parentIsList && !listItemIsObject
									? `${parentName} ${parseInt(key) + 1}`
									: key
							),
							type,
							rules: 'required',
							originalName: key,
							addOriginalNameOnNewField: listItemIsObject,
							parentName,
							...(isReference && {
								options: this.entryReferences[
									value.type || value
								],
							}),
							...(entryContent && {
								defaultValue:
									parentIsList && entryContent[index]
										? listItemIsObject
											? entryContent[index][key]
											: entryContent[index]
										: entryContent[key],
							}),
							...((value.type === 'html' || value === 'html') && {
								defaultHtmlEditor: true,
							}),
						}
					}
				})
			})

			return flattenDeep(result)
		},

		pullReferencedEntries() {
			const references = this.searchReferences(this.fieldSchema)
			for (const r of references) {
				this.fetchEntries({
					collection: r.split('$pq_reference_')[1],
					project: this.$route.params.slug,
					pageNum: 1,
					pageIndex: true,
				}).then(({ data }) => {
					this.$set(
						this.entryReferences,
						r,
						data.map((e) => ({
							label: e.label,
							value: `$pq_reference_${e.uuid}`,
						}))
					)
				})
			}
		},

		searchReferences(root) {
			let references = []
			if (!isObject(root)) {
				return references
			}
			Object.values(root).forEach((value) => {
				if (isObject(value)) {
					references = [
						...references,
						...this.searchReferences(value),
					]
				}

				if (
					typeof value === 'string' &&
					value.startsWith('$pq_reference_')
				)
					references = [...references, value]
			})
			return references
		},
		publishEntry() {
			this.savePage({
				payload: {
					publishPage: true,
					disableNewRevision: true,
				},
				page: this.entry.page.uuid,
				project: this.$route.params.slug,
			})
				.then(() => {
					this.$uikit.notification(
						`Successfully published the ${this.collectionName} page!`,
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
		exitEditor() {
			this.$router.go(-1) ||
				this.$router.push(
					`/projects/${this.project.slug}/collections/${this.collection.slug}`
				)
		},
		async saveEntryJson(data) {
			try {
				const entryContent = JSON.parse(data.entry_json)
				const entry = await this.saveEntry({
					payload: {
						entryData: {
							json_content: entryContent,
						},
					},
					collection: this.$route.params.collection,
					project: this.$route.params.slug,
					entry: this.entry.uuid,
				})

				if (entry) {
					this.$uikit.notification(
						'Entry saved successfully',
						'success'
					)
				} else {
					this.$uikit.notification(
						'Something went wrong. Please try again later',
						'danger'
					)
				}
			} catch (error) {
				console.log(error)
			}
		},
	},
}
</script>
<style lang="scss">
#entry-editor {
	#editor-nav {
		background-color: #fff;
		border-bottom: 1px solid var(--pw-tertiary);

		.exit-icon {
			height: 100%;
			border-left: 1px solid var(--pw-tertiary);
			padding: 0 20px;
			color: var(--text-tertiary);
		}
	}

	.ql-editor {
		font-size: 16px;
		min-height: 100px;
		color: #666;
	}

	.uk-form-label {
		font-size: 16px;
		font-weight: 500;
	}

	.uk-textarea {
		min-height: 100px;
	}
}
</style>
