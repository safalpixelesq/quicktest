<template>
	<div>
		<div class="uk-margin-top uk-grid" data-uk-grid>
			<div class="uk-flex uk-width-1-1 uk-flex-between uk-flex-middle">
				<h2 class="uk-text-medium uk-margin-bottom">Team</h2>
				<div>
					<button
						class="uk-button uk-button-default uk-button-small btn"
						@click="$uikit.modal('#crpg_modal').show()"
					>
						&plus; Invite User
					</button>
				</div>
			</div>
		</div>
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
					<th class="uk-table-expand">Name</th>
					<th class="uk-table-expand">Email</th>
					<th class="uk-table-shrink">Role</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in project.users" :key="user.id">
					<td>&nbsp;</td>
					<td>
						{{ user.username }}
					</td>
					<td>
						{{ user.email }}
					</td>
					<td>
						{{ user.pivot.role }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'Team',
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
		}),
	},
	mounted() {
		// console.log('object', this.project)
	},
}
</script>
