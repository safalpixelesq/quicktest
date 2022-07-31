export const state = () => ({
	theme: {},
	themes: [],
	systemThemes: [],
})

export const mutations = {
	SET_THEME(state, theme) {
		state.theme = theme
	},
	SET_THEMES(state, themes) {
		state.themes = themes
	},
	SET_SYSTEM_THEMES(state, themes) {
		state.systemThemes = themes
	},
}

export const actions = {
	setThemes({ commit }, themes) {
		commit('SET_THEMES', themes)
	},

	async getTheme({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/theme/${reqData.theme}`
			)
			commit('SET_THEME', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async fetchThemes({ commit }, project) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${project}/theme/index`
			)
			commit('SET_THEMES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async fetchSystemThemes({ commit }) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/system-theme/index`
			)
			commit('SET_SYSTEM_THEMES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async createTheme({ rootState }, reqData) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/${reqData.project}/theme/create`,
				reqData
			)

			return responseData
		} catch (error) {
			console.log(error)
		}
	},

	async saveTheme({ commit, state }, reqData) {
		const { data: responseData } = await this.$axios.post(
			`/api/${reqData.project}/theme/${reqData.theme}`,
			reqData
		)
		commit('SET_THEME', responseData.data)
	},

	async deleteTheme({ commit, rootState }, reqData) {
		try {
			const { data: responseData } = await this.$axios.patch(
				`/api/${reqData.project}/theme/${reqData.theme}/delete`
			)
			commit('SET_THEMES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},
}
