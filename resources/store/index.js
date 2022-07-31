export const getters = {
	isAuthenticated(state) {
		return state.auth.loggedIn
	},

	loggedInUser(state) {
		return state.auth.user
	},

	isAdmin(state) {
		return state.auth.user && state.auth.user.role === 'ADMIN'
	},

	groups(state) {
		return state.modules.groups
	},
}

export const actions = {
	async nuxtServerInit({ commit, dispatch }, { req }) {
		await dispatch('modules/getGroups', 'uikit')
	},
}
