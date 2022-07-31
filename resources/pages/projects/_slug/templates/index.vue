<template>
	<div class="uk-margin-top">
		<div class="uk-flex uk-flex-between uk-flex-middle">
			<h2 class="uk-text-medium uk-margin-remove">
				{{ project.name }}: Templates
			</h2>
			<div>
				<button
					class="uk-button uk-button-default uk-button-small btn"
					@click="$modal.show('add-template-modal')"
				>
					&plus; Create New Template
				</button>
			</div>
		</div>
		<div v-if="templates.length > 0" class="uk-margin-large">
			<table style="background: #fff" class="uk-table uk-table-divider">
				<thead>
					<tr>
						<th class="uk-table-shrink">&nbsp;</th>
						<th class="uk-table-expand">Name</th>
						<th class="uk-table-expand">Last Updated</th>
						<th class="uk-table-expand">Last Updated By</th>
						<th class="uk-table-shrink">Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="template in templates" :key="template.uuid">
						<td>&nbsp;</td>
						<td>
							{{ template.name }}
						</td>
						<td>
							{{ new Date(template.updated_at).toDateString() }}
						</td>
						<td>
							{{ template.author.username }}
						</td>
						<td>
							<div class="uk-flex">
								<nuxt-link
									:to="`/projects/${project.slug}/templates/${template.uuid}/edit`"
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
									@click="deleteTemplate(template)"
								>
									Delete
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<vue-modal
			name="add-template-modal"
			height="auto"
			:width="500"
			:scrollable="true"
		>
			<div class="uk-padding">
				<h2>Create a new template</h2>
				<FormContainer
					:fields="createTemplateFields"
					:submit-handler="createNewTemplate"
					submit-label="Create"
				/>
			</div>
		</vue-modal>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
	name: 'Templates',
	layout: 'project',
	async fetch({ store, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
		} catch (error) {
			console.log(error)
		}
	},
	computed: {
		...mapState({
			project: (state) => state.projects.project,
			templates: (state) => state.templates.templates,
		}),
		createTemplateFields() {
			return [
				{
					name: 'name',
					label: 'Template Name',
					type: 'text',
					rules: 'required|min:2|max:256',
				},
			]
		},
	},
	mounted() {
		this.fetchTemplates(this.$route.params.slug)
	},
	methods: {
		...mapActions({
			fetchTemplates: 'templates/fetchTemplates',
			createTemplate: 'templates/createTemplate',
			deleteTemplateAction: 'templates/deleteTemplate',
		}),
		async createNewTemplate(data) {
			const responseData = await this.createTemplate({
				templateData: { name: data.name, json_content: '' },
				project: this.$route.params.slug,
			})
			this.$modal.hide('add-template-modal')
			this.$router.push(
				`/projects/${this.project.slug}/templates/${responseData.data.uuid}/edit`
			)
		},
		deleteTemplate(template) {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete the template ${template.name}?`,
					{ labels: { ok: 'Delete', cancel: 'Cancel' } }
				)
				.then(() => {
					this.deleteTemplateAction({
						template: template.uuid,
						project: this.$route.params.slug,
					})
				})
		},
	},
}
</script>
