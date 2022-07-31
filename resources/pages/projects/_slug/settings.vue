<template>
	<div class="uk-margin-top">
		<div class="uk-grid" data-uk-grid>
			<div class="uk-width-3-4@m">
				<div class="">
					<div class="uk-margin-top uk-grid" data-uk-grid>
						<div class="uk-width-4-5@m">
							<h2 class="uk-text-medium uk-margin-bottom">
								{{ project.name }}: Settings
							</h2>
						</div>
					</div>
				</div>
				<main class="uk-margin-top uk-margin-bottom">
					<div
						v-for="(item, index) in settingForms"
						:key="index"
						class="uk-card uk-card-default uk-card-body uk-border-rounded uk-margin-large-top"
					>
						<h3 class="uk-margin-remove-bottom">
							{{ item.title }}
						</h3>
						<p class="uk-margin-remove-top">
							{{ item.subtitle }}
						</p>
						<FormContainer
							:fields="item.fields"
							:submit-label="item.submitLabel || 'Save'"
							:submit-button-class="item.submitButtonClass || ''"
							:submit-handler="item.handler"
						/>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import FormContainer from '@/components/form/FormContainer'

export default {
	name: 'ProjectSettings',
	components: {
		FormContainer,
	},
	layout: 'project',
	data() {
		return {
			createModal: false,

			pickedIntegration: '',
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

		settingForms() {
			return [
				{
					title: 'Your Project name',
					subtitle: 'Must be unique across your projects',
					fields: [
						{
							label: 'Project name',
							name: 'name',
							type: 'text',
							defaultValue: this.project.name || '',
							rules: 'required|min:2|max:256',
						},
					],
					handler: this.handleProjectSave,
				},
				{
					title: 'Select the API mode',
					subtitle: 'Choose based on the mode of integration',
					fields: [
						{
							label: 'API mode',
							name: 'apimode',
							type: 'select',
							options: [
								{
									label: 'Page',
									value: 'page',
								},
								{
									label: 'Component',
									value: 'component',
								},
							],
							defaultValue: this.project.apimode || '',
						},
					],
					handler: this.handleProjectSave,
				},
				{
					title: 'Select the default theme',
					subtitle: 'Choose the default theme for all pages',
					fields: [
						{
							label: 'Project theme',
							name: 'theme',
							type: 'select',
							options: this.themes.map((t) => ({
								label: t.name,
								value: t.id + '',
							})),
							defaultValue: `${
								this.project.setting.theme_id || ''
							}`,
							rules: 'required',
						},
					],
					handler: this.handleThemeSave,
				},
				{
					title: 'Configure host integration',
					subtitle:
						'Choose from the supported integrations and set credentials',
					fields: [
						{
							label: 'Integration',
							name: 'type',
							type: 'select',
							options: [
								{ label: 'Netlify', value: 'NETLIFY' },
								{ label: 'Custom Server (SSH)', value: 'SSH' },
							],
							defaultValue: `${
								(this.project.setting.integration &&
									this.project.setting.integration.type) ||
								''
							}`,
							rules: 'required',
							onChangeCb: (type) => {
								this.pickedIntegration = type
							},
						},
						...this.integrationFields(this.pickedIntegration),
					],
					handler: this.handleIntegrationSave,
				},
				{
					title: 'Export your project',
					subtitle:
						'Download the zip folder which includes all the site files.',
					fields: [],
					submitLabel: 'Download',
					handler: this.exportSite,
				},
				{
					title: 'Delete your project',
					subtitle: 'You will lose acceess to this project',
					fields: [],
					submitLabel: 'Delete',
					submitButtonClass: 'uk-button-danger',
					handler: this.handleSettingDelete,
				},
			]
		},
	},
	mounted() {
		this.fetchThemes(this.project.slug)
	},
	methods: {
		...mapActions({
			editProject: 'projects/editProject',
			fetchThemes: 'themes/fetchThemes',
			deleteProject: 'projects/deleteProject',
		}),

		async handleProjectSave(data) {
			try {
				await this.editProject({ id: this.project.id, ...data })
				this.$uikit.notification('Project setting updated', 'success')
			} catch (error) {
				console.log(error)
				this.$uikit.notification('Something went wrong', 'danger')
			}
		},
		async handleThemeSave(data) {
			try {
				await this.editProject({
					id: this.project.id,
					setting: {
						...data,
					},
				})
				this.$uikit.notification('Project theme updated', 'success')
			} catch (error) {
				console.log(error)
				this.$uikit.notification('Something went wrong', 'danger')
			}
		},
		async handleIntegrationSave(data) {
			try {
				const credentials = { ...data }
				delete credentials.type

				await this.editProject({
					id: this.project.id,
					setting: {
						integration: {
							type: data.type,
							credentials,
						},
					},
				})
				this.$uikit.notification(
					'Project integration updated',
					'success'
				)
			} catch (error) {
				console.log(error)
				this.$uikit.notification('Something went wrong', 'danger')
			}
		},
		handleSettingDelete() {
			this.$uikit.modal
				.confirm(
					`Are you sure you want to delete the project ${this.project.name}?`,
					{ labels: { ok: 'Delete', cancel: 'Cancel' } }
				)
				.then(() => {
					this.deleteProject({ id: this.project.id })
				})
				.catch((error) => {
					console.log(error)
					this.$uikit.notification('Something went wrong', 'danger')
				})
		},
		integrationFields(pickedIntegration) {
			const { integration } = this.project.setting
			const integrationType =
				pickedIntegration || (integration && integration.type)
			if (!integrationType) {
				return []
			}

			if (integrationType === 'NETLIFY') {
				return [
					{
						label: 'Access Token',
						name: 'accessToken',
						type: 'text',
						defaultValue:
							(integration &&
								integration.credentials.accessToken) ||
							'',
						rules: 'required',
					},
					{
						label: 'Site ID',
						name: 'siteId',
						type: 'text',
						defaultValue:
							(integration && integration.credentials.siteId) ||
							'',
						rules: 'required',
					},
				]
			} else if (integrationType === 'SSH') {
				return [
					{
						label: 'Username',
						name: 'username',
						type: 'text',
						defaultValue:
							(integration && integration.credentials.username) ||
							'',
						rules: 'required',
					},
					{
						label: 'Host',
						name: 'host',
						type: 'text',
						defaultValue:
							(integration && integration.credentials.host) || '',
						rules: 'required',
					},
					{
						label: 'Working Directory',
						name: 'workingDir',
						type: 'text',
						defaultValue:
							(integration &&
								integration.credentials.workingDir) ||
							'',
						rules: 'required',
					},
					{
						label: 'Private Key',
						name: 'privateKey',
						type: 'textarea',
						defaultValue:
							(integration &&
								integration.credentials.privateKey) ||
							'',
						rules: 'required',
					},
				]
			}
		},
		exportSite() {
			this.$axios
				.get(`/api/project/export/${this.project.id}`, {
					responseType: 'arraybuffer',
				})
				.then(({ data }) => {
					const url = window.URL.createObjectURL(new Blob([data]))
					const link = document.createElement('a')
					link.href = url
					link.setAttribute('download', `${this.project.slug}.zip`)
					document.body.appendChild(link)
					link.click()
				})
		},
	},
}
</script>
