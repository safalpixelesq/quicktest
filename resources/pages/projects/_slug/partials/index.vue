<template>
	<div class="uk-margin-top">
		<div class="uk-grid" data-uk-grid>
			<div class="uk-width-1-1@m">
				<div class="uk-margin-top uk-grid" data-uk-grid>
					<div
						class="uk-flex uk-width-1-1 uk-flex-between uk-flex-middle"
					>
						<h2 class="uk-text-medium uk-margin-bottom">
							{{ project.name }}: Partials
						</h2>
						<div>
							<button
								class="uk-button uk-button-default uk-button-small btn"
								@click="createPartialModalOpen = true"
							>
								&plus; New Partial
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-width-1-1">
				<div
					v-if="pushGlobalHeader"
					class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between uk-flex-middle"
				>
					<h4 class="uk-margin-remove-bottom">
						Please edit your site's default header
					</h4>
					<button
						class="uk-button uk-button-small uk-button-secondary"
						@click="pushCreatePartial('globalHeader')"
					>
						Edit header
					</button>
				</div>

				<div
					v-if="pushGlobalFooter"
					class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between uk-flex-middle uk-margin-top uk-margin-bottom"
				>
					<h4 class="uk-margin-remove-bottom">
						Please edit your site's default footer
					</h4>
					<button
						class="uk-button uk-button-small uk-button-secondary"
						@click="pushCreatePartial('globalFooter')"
					>
						Edit footer
					</button>
				</div>
			</div>

			<main class="uk-width-1-1@m uk-margin-small-top">
				<div
					v-if="partials.length > 0"
					class="container mx-auto px-4 sm:px-6 lg:px-8 my-5"
				>
					<table
						class="pq-table uk-table uk-table-responsive uk-table-divider uk-table-middle uk-table-large"
					>
						<thead>
							<tr>
								<!-- <th class="uk-table-shrink">SLno</th> -->
								<th class="uk-table-shrink">&nbsp;</th>
								<th class="uk-table-expand">Name</th>
								<th class="uk-table-expand">Last Updated</th>
								<th class="uk-table-expand">Last Updated By</th>

								<th class="uk-table-shrink">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="partial in partials" :key="partial.uuid">
								<td>&nbsp;</td>
								<td>
									<div class="uk-flex uk-flex-top">
										<img
											src="https://assets.uiaas.io/web/web-default.webp"
											width="90px"
											height="auto"
											alt="OG Image"
											class="uk-margin-right uk-border"
										/>
										<div>
											<div
												class="uk-text-medium uk-margin-remove uk-text-normal"
											>
												{{ partial.name }}
											</div>
										</div>
									</div>
								</td>
								<td>
									<div class="uk-margin-right">
										<div>
											{{
												new Date(
													partial.updated_at
												).toDateString()
											}}
										</div>
									</div>
								</td>
								<td>
									<div class="uk-margin-right">
										{{ partial.author.username }}
									</div>
								</td>
								<td>
									<div class="uk-flex">
										<nuxt-link
											:to="`/projects/${project.slug}/partials/${partial.uuid}/edit`"
											class="uk-margin-right"
										>
											Edit
										</nuxt-link>
										<button
											class="uk-button uk-button-text uk-text-danger uk-margin-right"
											@click="deletePartial(partial)"
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
			:open="createPartialModalOpen"
			:close-handler="() => (createPartialModalOpen = false)"
		>
			<div class="uk-modal-body">
				<h2>Create a new partial</h2>
				<FormContainer
					:fields="createPartialFields"
					:submit-handler="createNewPartial"
					submit-label="Create"
				/>
			</div>
		</Modal>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Modal from '@/components/Modal'
import FormContainer from '@/components/form/FormContainer'
export default {
	name: 'Partials',
	components: {
		Modal,
		FormContainer,
	},
	layout: 'project',
	data() {
		return {
			pushGlobalHeader: false,
			pushGlobalFooter: false,
			createPartialModalOpen: false,
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
			partials: (state) => state.partials.partials,
		}),
		...mapGetters({
			globalHeader: 'partials/globalHeader',
			globalFooter: 'partials/globalFooter',
		}),

		createPartialFields() {
			return [
				{
					name: 'name',
					label: 'Partial Name',
					type: 'text',
					rules: `required|min:2|max:256|dupePartial:${this.partials
						.map((p) => p.name)
						.join(',')}`,
				},
			]
		},
	},
	mounted() {
		if (!this.globalHeader || !this.globalHeader.isNotEmpty) {
			this.pushGlobalHeader = true
		}
		if (!this.globalFooter || !this.globalFooter.isNotEmpty) {
			this.pushGlobalFooter = true
		}
	},
	methods: {
		...mapActions({
			createPartial: 'partials/createPartial',
			deletePartialAction: 'partials/deletePartial',
		}),

		deletePartial(partial) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete the partial ${partial.name}?`,
					{ labels: { ok: 'Delete', cancel: 'Cancel' } }
				)
				.then(() => {
					this.deletePartialAction(partial.uuid)
				})
		},

		async createNewPartial(data) {
			const responseData = await this.createPartial({
				partialData: { name: data.name, json_content: '' },
			})
			this.createPartialModalOpen = false
			this.$router.push(
				`/projects/${this.project.slug}/partials/${responseData.data.uuid}/edit`
			)
		},

		pushCreatePartial(name) {
			this.$router.push(
				`/projects/${this.project.slug}/partials/${this[name].uuid}/edit`
			)
		},

		shouldShowDelete(partial) {
			return !['global-header', 'global-footer'].includes(partial.name)
		},
	},
}
</script>
