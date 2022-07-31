export const state = () => ({
	collection: {},
	collections: [],
})

export const mutations = {
	SET_COLLECTION(state, collection) {
		state.collection = collection
	},
	SET_COLLECTIONS(state, collections) {
		state.collections = collections
	},
}

export const actions = {
	async getCollection({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/collection/${reqData.collection}`
			)
			commit('SET_COLLECTION', responseData.data)
			return responseData.data
		} catch (error) {
			console.log(error)
		}
	},

	async fetchCollections({ commit }, project) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${project}/collection/index`
			)
			commit('SET_COLLECTIONS', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async createCollection({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/${reqData.project}/collection/create`,
				reqData
			)
			return responseData
		} catch (error) {
			console.log(error)
		}
	},

	async saveCollection({ commit, state }, reqData) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/${reqData.project}/collection/${reqData.collection}`,
				reqData
			)
			commit('SET_COLLECTION', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async deleteCollection({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.patch(
				`/api/${reqData.project}/collection/${reqData.collection}/delete`
			)
			commit('SET_COLLECTIONS', responseData.data)
			this.$router.push(`/projects/${reqData.project}/collections`)
		} catch (error) {
			console.log(error)
		}
	},
}
