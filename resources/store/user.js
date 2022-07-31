// import router from './router'
import ApiService from '~/services/ApiService.js'

export const state = () => ({
	apiuser: {},
	token: '',
	hasToken: false
})

export const mutations = {
	SET_TOKEN(state, payload) {
		state.token = payload
	},
	HAS_TOKEN(state, payload) {
		state.hasToken = payload
	},
	REVOKE_TOKEN(state) {
		state.hasToken = false
	},
	HIDE_TOKEN(state) {
		state.token = ''
	},
	UPDATE_PROFILE(state, payload) {
		state.apiuser = payload
	}
}

export const actions = {
	async generateToken({ commit }) {
		return await this.$axios
			.$get(`/api/auth/generate-token`)
			.then((response) => {
				commit('SET_TOKEN', response.token)
			})
	},

	async hasToken({ commit }, payload) {
		return await this.$axios
			.$get(`/api/auth/tokens`, payload)
			.then((response) => {
				commit('HAS_TOKEN', response)
			})
	},
	async hideToken({ commit }) {
		await commit('HIDE_TOKEN')
	},

	async revokeToken({ commit }) {
		return await this.$axios
			.$get(`/api/auth/revoke-token`)
			.then((response) => {
				commit('REVOKE_TOKEN')
			})
	},

	async updateProfile({ commit }) {
		return await ApiService.updateProfile().then((response) => {
			commit('UPDATE_PROFILE', response.data)
		})
	}
}
