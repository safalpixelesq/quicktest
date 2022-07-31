export const state = () => ({
	entry: {},
	entries: {
		data: [],
	},
})

export const mutations = {
	SET_ENTRY(state, entry) {
		state.entry = entry
	},
	SET_ENTRIES(state, entries) {
		state.entries = entries
	},
}

export const actions = {
	setEntries({ commit }, entries) {
		commit('SET_ENTRIES', entries)
	},

	async getEntry({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/${reqData.collection}/entry/${reqData.entry}`
			)
			commit('SET_ENTRY', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async getSampleEntry({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/${reqData.collection}/entry/sample`
			)
			return responseData.data
		} catch (error) {
			console.log(error)
		}
	},

	async fetchEntries({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/${
					reqData.collection
				}/entry/index?pageNum=${reqData.pageNum || 1}&perPage=${
					reqData.perPage || 20
				}&search=${reqData.search || ''}&${
					reqData.pageIndex ? 'pageIndex= 1' : ''
				}`
			)
			return responseData
		} catch (error) {
			console.log(error)
		}
	},

	async createEntry({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/${reqData.project}/${reqData.collection}/entry/create`,
				reqData.payload
			)
			commit('SET_ENTRY', responseData.data)
			return responseData.data
		} catch (error) {
			console.log(error)
			return null
		}
	},

	async saveEntry({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/${reqData.project}/${reqData.collection}/entry/${reqData.entry}`,
				reqData.payload
			)
			commit('SET_ENTRY', responseData.data)
			return responseData.data
		} catch (error) {
			console.log(error)
			return null
		}
	},

	async deleteEntry({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.patch(
				`/api/${reqData.project}/${reqData.collection}/entry/${reqData.entry}/delete`
			)
			commit('SET_ENTRIES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},
}
