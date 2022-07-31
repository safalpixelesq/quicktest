<template>
	<div class="uk-margin-top">
		<div class="uk-grid" data-uk-grid>
			<div class="uk-width-1-1@m">
				<div class="uk-margin-top uk-grid" data-uk-grid>
					<div
						class="
							uk-flex uk-width-1-1 uk-flex-between uk-flex-middle
						"
					>
						<h2 class="uk-text-medium uk-margin-bottom">
							{{ project.name }}: Themes
						</h2>
						<div>
							<button
								class="
									uk-button uk-button-default uk-button-small
									btn
								"
								@click="createThemeModalOpen = true"
							>
								&plus; New Theme
							</button>
						</div>
					</div>
				</div>
			</div>

			<main class="uk-width-1-1@m uk-margin-small-top">
				<div
					v-if="themes.length > 0"
					class="container mx-auto px-4 sm:px-6 lg:px-8 my-5"
				>
					<table
						class="
							pq-table
							uk-table
							uk-table-responsive
							uk-table-divider
							uk-table-middle
							uk-table-large
						"
					>
						<thead>
							<tr>
								<th class="uk-table-shrink">&nbsp;</th>
								<th>Name</th>
								<th>Last Updated</th>
								<th>Type</th>
								<th class="uk-table-expand">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="theme in themes" :key="theme.id">
								<td>&nbsp;</td>
								<td>
									{{ theme.name }}
								</td>
								<td>
									<span v-if="theme.updated_at">
										{{
											new Date(
												theme.updated_at
											).toDateString()
										}}
									</span>
									<span v-else>--</span>
								</td>
								<td>
									<span
										v-if="theme.system_default"
										class="uk-label uk-label-success"
									>
										System
									</span>
									<span
										v-else
										class="uk-label uk-label-warning"
									>
										Custom
									</span>
								</td>
								<td>
									<div
										v-if="!theme.system_default"
										class="uk-flex"
									>
										<nuxt-link
											:to="`/projects/${project.slug}/themes/${theme.id}/edit`"
											class="uk-margin-right"
										>
											Edit
										</nuxt-link>
										<button
											class="
												uk-button
												uk-button-text
												uk-text-danger
												uk-margin-right
											"
											@click="deleteTheme(theme)"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</main>
		</div>

		<Modal
			:open="createThemeModalOpen"
			:close-handler="() => (createThemeModalOpen = false)"
		>
			<div class="uk-modal-body">
				<h2>Create a new theme</h2>
				<FormContainer
					:fields="createThemeFields"
					:submit-handler="createNewTheme"
					submit-label="Create"
				/>
			</div>
		</Modal>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Modal from '@/components/Modal'
import FormContainer from '@/components/form/FormContainer'
export default {
	name: 'Pages',
	components: {
		Modal,
		FormContainer,
	},
	layout: 'project',
	data() {
		return {
			createThemeModalOpen: false,
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
			themes: (state) => state.themes.themes,
		}),
		createThemeFields() {
			return [
				{
					name: 'name',
					label: 'Theme Name',
					type: 'text',
					rules: 'required|min:2|max:256',
				},
			]
		},
	},
	mounted() {
		this.fetchThemes(this.project.slug)
	},
	methods: {
		...mapActions({
			createTheme: 'themes/createTheme',
			fetchThemes: 'themes/fetchThemes',
			deleteThemeAction: 'themes/deleteTheme',
		}),
		deleteTheme(theme) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete the theme ${theme.name}?`,
					{ labels: { ok: 'Delete', cancel: 'Cancel' } }
				)
				.then(() => {
					this.deleteThemeAction({
						project: this.project.slug,
						theme: theme.id,
					})
				})
		},

		createNewTheme(data) {
			this.createTheme({
				themeData: { name: data.name },
				project: this.project.slug,
			}).then((responseData) => {
				this.createThemeModalOpen = false
				this.$router.push(
					`/projects/${this.project.slug}/themes/${responseData.data.id}/edit`
				)
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.list-header {
	> div {
		text-transform: uppercase;
		font-size: 16px;
	}
}
</style>
