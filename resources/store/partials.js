export const state = () => ({
	partial: {},
	partials: [],
})

export const mutations = {
	SET_PARTIAL(state, partial) {
		state.partial = partial
	},
	SET_PARTIALS(state, partials) {
		state.partials = partials
	},
}

export const actions = {
	setPartials({ commit }, partials) {
		commit('SET_PARTIALS', partials || [])
	},

	async fetchPartials({ commit }, projectID) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/partial/index?projectID=${projectID}`
			)
			commit('SET_PARTIALS', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async getPartial({ commit }, partialid) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/partial/${partialid}`
			)
			commit('SET_PARTIAL', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async createPartial({ rootState }, payload) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/partial/create`,
				{
					...payload,
					projectID: rootState.projects.project.id,
				}
			)
			return responseData
		} catch (error) {
			console.log(error)
		}
	},

	async savePartial({ commit, state }, payload) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/partial/${state.partial.uuid}`,
				payload
			)
			commit('SET_PARTIAL', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async deletePartial({ commit, rootState }, partialID) {
		try {
			const { data: responseData } = await this.$axios.patch(
				`/api/partial/${partialID}/delete`,
				{
					pid: rootState.projects.project.id,
				}
			)
			commit('SET_PARTIALS', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},
}

export const getters = {
	partialsAsModuleMenu(state) {
		return {
			key: 'partial',
			title: 'Partial',
			desc: 'Partials are reusable modules of your project.',
			count: state.partials.length,
			modules: state.partials.map((p) => p.module),
		}
	},

	globalHeader(state) {
		const header = state.partials.find(
			(item) => item.name === 'global-header'
		)
		if (!header) {
			return null
		}
		return {
			...header,
			isNotEmpty: header.json_content && !!header.json_content.length,
		}
	},

	globalFooter(state) {
		const footer = state.partials.find(
			(item) => item.name === 'global-footer'
		)
		if (!footer) {
			return null
		}
		return {
			...footer,
			isNotEmpty: footer.json_content && !!footer.json_content.length,
		}
	},
}
