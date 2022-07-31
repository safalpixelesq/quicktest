export const state = () => ({
	page: {},
	pages: {
		data: [],
	},
	activeRevision: {},
})

export const mutations = {
	SET_PAGE(state, page) {
		state.page = page
	},
	SET_PAGES(state, pages) {
		state.pages = pages
	},
	SET_ACTIVE_REVISION(state, revision) {
		state.activeRevision = revision
	},
	SET_PAGE_META(state, meta) {
		state.page = {
			...state.page,
			meta: { ...state.page.meta, ...meta },
		}
	},
	DELETE_PAGE(state, uuid) {
		const deleteIndex = state.pages.findIndex((p) => p.uuid === uuid)
		if (deleteIndex > -1) {
			state.pages.splice(deleteIndex, 1)
		}
	},
	SET_PREVIEW(state, preview) {
		state.preview = preview
	},
}

export const actions = {
	async fetchPages({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/page/index?pageNum=${
					reqData.pageNum || 1
				}&search=${reqData.search || ''}`
			)
			commit('SET_PAGES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async createPage({ commit }, reqData) {
		const { data: responseData } = await this.$axios.post(
			`/api/${reqData.project}/page/create`,
			{
				...reqData.payload,
			}
		)
		return responseData
	},

	async getCurrentPage({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/page/${reqData.page}`
			)
			commit('SET_PAGE', responseData.data)
			commit('SET_ACTIVE_REVISION', responseData.data.revisions[0])
		} catch (error) {
			console.log(error)
		}
	},

	async savePage({ commit }, reqData) {
		const { data: responseData } = await this.$axios.post(
			`/api/${reqData.project}/page/${reqData.page}/revision`,
			reqData.payload
		)
		commit('SET_PAGE', responseData.data)
		commit('SET_ACTIVE_REVISION', responseData.data.revisions[0])
		return responseData
	},

	async revertRevision({ commit, state }, payload) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/page/${state.page.uuid}/revision/revert`,
				payload
			)
			commit('SET_PAGE', responseData.data)
			commit('SET_ACTIVE_REVISION', responseData.data.revisions[0])
		} catch (error) {
			console.log(error)
		}
	},

	async duplicatePage({ commit }, reqData) {
		const { data: responseData } = await this.$axios.post(
			`/api/${reqData.project}/page/${reqData.page}/duplicate`,
			{
				...reqData.payload,
			}
		)
		return responseData
	},

	async deletePage({ commit }, reqData) {
		const { data: responseData } = await this.$axios.patch(
			`/api/${reqData.project}/page/${reqData.page}/delete`
		)
		commit('SET_PAGES', responseData.data)
	},

	async previewPage({ commit }, reqData) {
		const { data: responseData } = await this.$axios.get(
			`/api/${reqData.project}/page/${reqData.page}/preview?version=${
				reqData.version || 'draft'
			}`
		)
		commit('SET_PREVIEW', responseData.data)
	},
}
