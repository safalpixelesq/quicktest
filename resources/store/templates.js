export const state = () => ({
	template: {},
	templates: [],
})

export const mutations = {
	SET_TEMPLATE(state, template) {
		state.template = template
	},
	SET_TEMPLATES(state, templates) {
		state.templates = templates
	},
}

export const actions = {
	async fetchTemplates({ commit }, project) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${project}/template/index`
			)
			commit('SET_TEMPLATES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},

	async getTemplate({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.get(
				`/api/${reqData.project}/template/${reqData.template}`
			)
			commit('SET_TEMPLATE', responseData.data)
		} catch (error) {
			console.log(error)
			commit('SET_TEMPLATE', null)
		}
	},

	async createTemplate({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.post(
				`/api/${reqData.project}/template/create`,
				reqData
			)
			return responseData
		} catch (error) {
			console.log(error)
		}
	},

	saveTemplate({ commit }, reqData) {
		return new Promise((resolve, reject) => {
			this.$axios
				.post(
					`/api/${reqData.project}/template/${reqData.template}`,
					reqData
				)
				.then(({ data: responseData }) => {
					commit('SET_TEMPLATE', responseData.data)
					resolve()
				})
				.catch((error) => {
					reject(error)
				})
		})
	},

	async deleteTemplate({ commit }, reqData) {
		try {
			const { data: responseData } = await this.$axios.patch(
				`/api/${reqData.project}/template/${reqData.template}/delete`
			)
			commit('SET_TEMPLATES', responseData.data)
		} catch (error) {
			console.log(error)
		}
	},
}
