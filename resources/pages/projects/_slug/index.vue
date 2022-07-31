<template>
	<div class="uk-margin-large-top">
		<div
			v-if="activities.length"
			class="uk-card uk-card-default uk-border-rounded uk-margin-large"
		>
			<div class="uk-card-body">
				<h3 class="uk-text-bold uk-border-bottom">Recent activity</h3>
				<hr />
				<div>
					<div
						v-for="activity in activities"
						:key="activity.id"
						class="uk-flex uk-flex-middle uk-margin"
					>
						<div
							class="activity-icon"
							:style="actionMapping[activity.action].style"
						>
							<span
								:uk-icon="actionMapping[activity.action].icon"
							>
							</span>
						</div>
						<div class="">
							<p class="uk-margin-remove">
								<span class="uk-text-bold">
									{{
										loggedInUser.email ===
										activity.user.email
											? 'You'
											: activity.user.username
									}}
								</span>
								{{ actionMapping[activity.action].text }}
								<nuxt-link
									:to="`/projects/${project.slug}/pages/${activity.page.uuid}/preview`"
								>
									{{ activity.page.meta.title }}
								</nuxt-link>
							</p>
							<span class="uk-text-meta">
								{{
									new Date(activity.created_at).toDateString()
								}}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="uk-card uk-card-default uk-border-rounded uk-margin-large">
			<div class="uk-card-body">
				<h3 class="uk-text-bold uk-border-bottom">Site Checklist</h3>
				<hr />
				<div>
					<ul class="uk-list uk-list-divider">
						<li
							v-for="(item, i) in siteChecklist"
							:key="i"
							class="uk-flex uk-flex-between uk-flex-top"
						>
							<div class="uk-margin-large-right">
								<h5 class="uk-margin-remove-bottom">
									<nuxt-link
										v-if="!item.completed"
										:to="item.link"
									>
										{{ item.label }}
									</nuxt-link>
									<span v-else class="uk-text-success">
										{{ item.label }}
									</span>
								</h5>
								<p class="uk-text-meta uk-margin-small-top">
									{{ item.help }}
								</p>
							</div>

							<span
								class="uk-label uk-label-success"
								:style="{
									opacity: item.completed ? 1 : 0,
								}"
							>
								COMPLETED
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
	name: 'ProjectOverview',
	components: {},
	layout: 'project',
	data() {
		return {
			activities: [],
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
		...mapGetters(['loggedInUser']),
		...mapState({
			project: (state) => state.projects.project,
		}),
		...mapGetters({
			globalHeader: 'partials/globalHeader',
			globalFooter: 'partials/globalFooter',
		}),
		actionMapping() {
			return {
				SAVED: {
					text: 'saved the page',
					icon: 'check',
					style: {
						color: 'rgb(10, 204, 149)',
						background: 'rgba(10, 204, 149, 0.4)',
					},
				},
				PUBLISHED: {
					text: 'published the page',
					icon: 'push',
					style: {
						color: 'rgb(92, 23, 212)',
						background: 'rgba(92, 23, 212, 0.4)',
					},
				},
				DELETED: {
					text: 'deleted the page',
					icon: 'trash',
					style: {
						color: 'rgb(214, 32, 59)',
						background: 'rgba(214, 32, 59, 0.4)',
					},
				},
				REVERTED: {
					text: 'reverted the page revision',
					icon: 'history',
					style: {
						color: 'rgb(232, 206, 9)',
						background: 'rgba(232, 206, 9, 0.4)',
					},
				},
			}
		},
		siteChecklist() {
			return [
				{
					label: "Create your site's default header",
					help: 'Site header is automatically addeed to every pages you create in future. Please start by creating a header from our awesome collection.',
					link: this.globalHeader
						? `/projects/${this.project.slug}/partials/${this.globalHeader.uuid}/edit`
						: '',
					completed:
						this.globalHeader &&
						this.globalHeader.json_content &&
						this.globalHeader.json_content.length > 0,
				},
				{
					label: "Create your site's default footer",
					help: 'Site footer is automatically addeed to every pages you create in future. Please start by creating a footer from our awesome collection.',
					link: this.globalFooter
						? `/projects/${this.project.slug}/partials/${this.globalFooter.uuid}/edit`
						: '',
					completed:
						this.globalFooter &&
						this.globalFooter.json_content &&
						this.globalFooter.json_content.length > 0,
				},
				{
					label: "Upload your site's favicon",
					help: 'Favicon is your sites profile picture, it will be automatically addeed to every pages. Please upload a favicon of your choice.',
					link: `/projects/${this.project.slug}/partials`,
					completed: false,
				},
				{
					label: 'Create a custom site theme',
					help: 'Creating a custom theme sets your site apart. You can customize colors, fonts and background and switch between themes with great flexibility. Please start by creating a your custom theme using our theme editor.',
					link: `/projects/${this.project.slug}/themes`,
					completed: false,
				},
			]
		},
	},
	mounted() {
		this.$axios
			.get(`/api/activity/list?projectID=${this.project.id}`, {})
			.then(({ data: responseData }) => {
				this.activities = responseData.data
			})
	},
}
</script>
<style lang="scss" scoped>
.activity-icon {
	height: 52px;
	width: 52px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	margin-right: 20px;
}
</style>
