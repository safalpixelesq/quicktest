<template>
	<div class="action-group uk-flex">
		<button class="action-button" type="button" @click="editPage">
			<span class="uk-margin-small-right" uk-icon="pencil"></span>
			Edit
		</button>
		<div class="uk-inline">
			<button class="action-button action-dropper">
				<span uk-icon="chevron-down"></span>
			</button>
			<div uk-dropdown="mode: hover; pos: bottom-right; delay-hide: 200;">
				<ul class="uk-nav uk-dropdown-nav">
					<li
						v-if="page.publishedRevision[0]"
						class="uk-margin-bottom"
						@click="previewPage('published')"
					>
						<span
							class="uk-margin-small-right"
							uk-icon="desktop"
						></span>
						Preview Published
					</li>
					<li
						v-if="page.draftRevision[0]"
						class="uk-margin-bottom"
						@click="previewPage('draft')"
					>
						<span
							class="uk-margin-small-right"
							uk-icon="desktop"
						></span>
						Preview Draft
					</li>
					<li
						v-if="page"
						class="uk-margin-bottom"
						@click="editSeoModalOpen = true"
					>
						<span
							class="uk-margin-small-right"
							uk-icon="desktop"
						></span>
						Edit SEO
					</li>
					<li class="uk-margin-bottom" @click="$emit('duplicate')">
						<span
							class="uk-margin-small-right"
							uk-icon="copy"
						></span>
						Duplicate
					</li>
					<li class="uk-text-danger" @click="$emit('delete')">
						<span
							class="uk-margin-small-right"
							uk-icon="trash"
						></span>
						Delete
					</li>
				</ul>
			</div>
		</div>
		<Modal
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
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name: 'PageActions',
	components: {
		// Link,
	},
	props: {
		project: { type: Object, required: true },
		page: { type: Object, required: true },
	},
	data() {
		return {
			editSeoModalOpen: false,
		}
	},
	computed: {
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
	methods: {
		...mapActions({
			savePage: 'pages/savePage',
		}),
		editPage() {
			if (this.page.entry) {
				this.$router.push(
					`/projects/${this.project.slug}/collections/${this.page.entry.collection.slug}/${this.page.entry.uuid}/edit`
				)
			} else {
				this.$router.push(
					`/projects/${this.project.slug}/pages/${this.page.uuid}/edit`
				)
			}
		},

		previewPage(version) {
			// window.open(
			// 	`${process.env.API_URL}/api/page/preview?id=${
			// 		this.page.uuid
			// 	}&project=${this.project.slug}_${this.project.id}${
			// 		draft ? '&draft=true' : ''
			// 	}`
			// )
			this.$router.push(
				`/projects/${this.project.slug}/pages/${this.page.uuid}/preview?version=${version}`
			)
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
					window.location.reload()
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
	},
}
</script>
<style lang="scss" scoped>
.action-group li {
	cursor: pointer;
}

.action-group li:hover {
	font-weight: 500;
}

.action-button {
	font-family: inherit;
	display: flex;
	align-items: center;
	background-color: transparent;
	border-radius: 0;
	height: 34px;
	padding: 0 14px;
	border: 1px solid #ddd;
}

.action-button:hover {
	border-color: #000;
}

.action-dropper {
	padding: 0 8px;
	border-left-color: transparent;
}
</style>
