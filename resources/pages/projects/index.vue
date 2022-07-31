<template>
	<div class="uk-margin-top">
		<div class="uk-grid" data-uk-grid>
			<div class="uk-width-3-4@m">
				<div
					class="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom"
				>
					<div>
						<h2 class="uk-text-medium uk-margin-remove-bottom">
							Projects
						</h2>
					</div>
					<div>
						<button
							class="uk-button uk-button-default uk-button-small btn"
							@click="createProjectModalOpen = true"
						>
							&plus; New Project
						</button>
					</div>
				</div>

				<main class="">
					<div class="">
						<nuxt-link
							v-for="project in projects"
							:key="project.id"
							:to="'/projects/' + project.slug"
							class="uk-card uk-card-default uk-border-rounded uk-display-block uk-box-shadow-hover-large uk-margin-medium-bottom project-card"
						>
							<div class="uk-grid uk-grid-collapse" data-uk-grid>
								<div class="uk-width-medium">
									<div class="browser-fr">
										<img
											:src="
												project.icon
													? project.icon
													: 'https://assets.uiaas.io/web/web-default.webp'
											"
											:alt="project.name + ' Image'"
										/>
									</div>
									<div class="proj-img"></div>
								</div>
								<div class="uk-width-expand@m">
									<div class="detail-card">
										<div
											class="uk-h2 uk-text-medium uk-margin-remove-bottom"
										>
											{{ project.name }}
										</div>
										<div class="uk-margin-small-top">
											<div
												class="uk-h1 uk-margin-remove-bottom uk-text-light pw-font-body"
											>
												{{
													project.__meta__
														? project.__meta__
																.pages_count
														: 0
												}}
											</div>
											page/s
										</div>
									</div>
								</div>
							</div>
						</nuxt-link>

						<Modal
							:open="createProjectModalOpen"
							:close-handler="
								() => (createProjectModalOpen = false)
							"
						>
							<div class="uk-modal-body">
								<h2>Create a new project</h2>
								<FormContainer
									:fields="createProjectFields"
									:submit-handler="createNewProject"
									submit-label="Create"
								/>
							</div>
						</Modal>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Modal from '@/components/Modal'
import FormContainer from '@/components/form/FormContainer'

export default {
	name: 'Projects',
	components: {
		Modal,
		FormContainer,
	},
	layout: 'dashboard',
	data() {
		return {
			createProjectModalOpen: false,
		}
	},
	async fetch({ store, error }) {
		try {
			await store.dispatch('projects/getUserProjects')
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	computed: {
		...mapState({
			systemThemes: (state) => state.themes.systemThemes,
		}),
		projects() {
			return this.$store.state.projects.projects
		},
		projectcsv() {
			const psrt =
				this.projects &&
				this.projects
					.map((item) => {
						return item.slug
					})
					.join(',')
			return psrt
		},
		createProjectFields() {
			return [
				{
					name: 'name',
					label: 'Project name',
					type: 'text',
					rules: `required|min:2|max:256|dupe:${this.projectcsv}`,
				},
				{
					name: 'theme',
					label: 'Use system theme (Optional)',
					type: 'select',
					options: this.systemThemes.map((t) => ({
						label: t.name,
						value: t.id + '',
					})),
				},
			]
		},
	},
	mounted() {
		if (!this.systemThemes || !this.systemThemes.length) {
			this.fetchSystemThemes()
		}
	},
	methods: {
		...mapActions({
			createProject: 'projects/createProject',
			fetchSystemThemes: 'themes/fetchSystemThemes',
		}),

		async createNewProject(data) {
			try {
				const responseData = await this.createProject({ ...data })
				this.createProjectModalOpen = false
				this.$router.push(`/projects/${responseData.slug}/settings`)
			} catch (error) {
				console.log(error)
				this.$uikit.notification(
					'Something went wrong. Please try again later.',
					'danger'
				)
				this.createProjectModalOpen = false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.uk-border-rounded {
	border-radius: 10px;
}
.browser-fr {
	border-radius: 4px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	box-shadow: 0 4px 13px rgb(0 0 0 / 15%);
	background-color: #fff;
	margin: 40px;
	margin-right: 0;
	margin-bottom: 0;
	overflow: hidden;
}

.detail-card {
	padding-top: 35px;
	padding-left: 50px;
}
.project-card {
	&:hover {
		text-decoration: none;
	}
}
</style>
