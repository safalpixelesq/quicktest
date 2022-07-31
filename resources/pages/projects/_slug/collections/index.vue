<template>
	<div class="uk-margin-top">
		<div class="uk-flex uk-flex-between uk-flex-middle">
			<h2 class="uk-text-medium uk-margin-remove">
				{{ project.name }}: Collections
			</h2>
			<div>
				<button
					class="uk-button uk-button-default uk-button-small btn"
					@click="$modal.show('add-coll-modal')"
				>
					&plus; Create New Collection
				</button>
			</div>
		</div>
		<div class="uk-margin-large">
			<nuxt-link
				v-for="(collection, index) in collections"
				:key="index"
				:to="`/projects/${project.slug}/collections/${collection.slug}`"
				class=""
			>
				<div class="uk-card uk-card-default uk-margin-medium">
					<div
						class="uk-flex uk-flex-between uk-flex-middle uk-padding"
					>
						<div>
							<h3 class="uk-margin-remove">
								{{ titleCase(collection.name) }}
							</h3>
							<span
								v-if="collection.__meta__"
								class="uk-text-meta"
							>
								Total entries:
								{{ collection.__meta__.entries_count }}
							</span>
						</div>
						<span uk-icon="icon: chevron-right; ratio: 1.5"></span>
					</div>
				</div>
			</nuxt-link>
		</div>
		<vue-modal
			name="add-coll-modal"
			height="auto"
			:width="500"
			:scrollable="true"
		>
			<div class="uk-padding">
				<h2>Create a new collection</h2>
				<FormContainer
					:fields="createCollectionFields"
					:submit-handler="createNewCollection"
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
export default {
	name: 'Collections',
	components: {
		FormContainer,
	},
	layout: 'project',
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
			collections: (state) => state.collections.collections,
		}),
		createCollectionFields() {
			return [
				{
					name: 'name',
					label: 'Collection Name',
					type: 'text',
					rules: 'required|min:2|max:256',
				},
				{
					name: 'slug',
					label: 'Collection Slug',
					type: 'text',
					mode: 'lazy',
					rules: {
						required: true,
						min: 2,
						max: 256,
						noSlash: true,
						beValidation: {
							validatorFunc: this.checkIfUniqueSlug,
							msg: 'Slug is already in use',
						},
					},
				},
				{
					name: 'has_pages',
					label: 'Collection has pages',
					type: 'checkbox',
					defaultValue: false,
				},
			]
		},
	},
	mounted() {
		this.fetchCollections(this.$route.params.slug)
	},
	methods: {
		...mapActions({
			fetchCollections: 'collections/fetchCollections',
			createCollection: 'collections/createCollection',
		}),
		titleCase,
		createNewCollection(data) {
			this.createCollection({
				collectionData: data,
				project: this.$route.params.slug,
			}).then((responseData) => {
				this.$modal.hide('add-coll-modal')
				this.$router.push(
					`/projects/${this.project.slug}/collections/${responseData.data.slug}`
				)
			})
		},
		checkIfUniqueSlug(value) {
			return this.$axios
				.get(
					`/api/${this.project.slug}/collection/form/validation?value=${value}&type=unique-slug`
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
