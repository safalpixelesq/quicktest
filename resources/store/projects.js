// import router from './router'
// import ApiService from '~/services/ApiService.js'

export const state = () => ({
	projects: [],
})

export const mutations = {
	SET_USER_PROJECTS(state, projects) {
		state.projects = projects
	},
	SET_PROJECT(state, payload) {
		state.project = payload
	},
	CREATE_PROJECT(state, payload) {
		state.projects.push(payload)
	},
	EDIT_PROJECT(state, payload) {
		const project = state.projects.find((item) => item.id === payload.id)
		state.projects.splice(state.projects.indexOf(project), 1, payload)
	},
	DELETE_PROJECT(state, payload) {
		const project = state.projects.find((item) => item.id === payload)
		state.projects.splice(state.projects.indexOf(project), 1)
	},
}

export const actions = {
	async errorRedirect({ commit }) {
		return await this.$axios.$get('/api/project/index').then((response) => {
			commit('SET_USER_PROJECTS', response.data)
		})
	},
	async getUserProjects({ commit }) {
		return await this.$axios.$get('/api/project/index').then((response) => {
			commit('SET_USER_PROJECTS', response.data)
		})
	},
	async createProject({ commit }, payload) {
		const { data } = await this.$axios.$post('/api/project/create', payload)
		commit('CREATE_PROJECT', data)
		return data
	},

	async editProject({ commit }, payload) {
		const { data } = await this.$axios.$patch(
			`/api/project/update/${payload.id}`,
			payload
		)
		commit('EDIT_PROJECT', data)
	},

	async getCurrentProject({ commit, dispatch }, payload) {
		return await this.$axios
			.$get(`/api/project/index/${payload}`)
			.then((response) => {
				commit('SET_PROJECT', response.data[0])
				dispatch('partials/setPartials', response.data[0].partials, {
					root: true,
				})
			})
			.catch((error) => {
				console.log(error)
				return this.$router.push('/projects')
			})
	},

	async deleteProject({ commit }, payload) {
		return await this.$axios
			.$patch(`/api/project/delete/${payload.id}`)
			.then((response) => {
				commit('DELETE_PROJECT', payload.id)
				this.$router.push(`/projects`)
			})
	},
}

export const getters = {
	assetFolder(state) {
		return state.project ? `${state.project.slug}_${state.project.id}` : ''
	},
}
