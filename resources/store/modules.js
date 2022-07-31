// import router from './router'
import ApiService from '~/services/ApiService.js'
const _ = require('lodash')

export const state = () => ({
	groups: [],
	modules: [],
	module: {},
	fullpage: [],
	htmlstr: '',
	preview: '',
	pagehtml: '',
	variant: 0,
})

export const mutations = {
	SET_GROUPS(state, groups) {
		state.groups = groups
	},

	SET_MODULES(state, modules) {
		state.modules = modules
	},

	SET_MODULE(state, payload) {
		state.module = payload
	},

	UPDATE_MODULE(state, payload) {
		// state.module.context.style[payload.key] = payload.attr
		// state.module.context.style = Object.assign(
		// 	state.module.context.style,
		// 	payload
		// )
		state.module = payload
		// console.log('adfadasd', state.module, payload, 'adsad')
	},

	UPDATE_MODCONTENT(state, payload) {
		if (payload.key === 'context') {
			state.module[payload.key] = payload.attr
		} else {
			state.module.context[payload.key] = payload.attr
		}
	},

	UPDATE_FULLPAGE(state, payload) {
		switch (payload.evt) {
			case 'add':
				state.fullpage = payload.attr
				break
			case 'remove':
				state.fullpage.splice(payload.mid, 1)
				break
			case 'update':
				state.fullpage[payload.mid] = payload.module
				break
			default:
				state.fullpage[payload.mid][payload.key] = payload.attr
				break
		}
	},

	UPDATE_HTML(state, payload) {
		state.htmlstr = payload
	},

	SET_HTMLSTR(state, payload) {
		state.htmlstr = payload
	},

	SET_PAGEHTML(state, payload) {
		state.pagehtml = payload
	},

	SET_PREVIEW(state, payload) {
		state.preview = payload
	},

	SET_VARIANT(state, payload) {
		state.variant = payload
	},

	SET_FULLPAGE(state, payload) {
		state.fullpage = payload
	},
}

export const actions = {
	async getGroups({ commit, state }, payload) {
		return await ApiService.getGroups(payload).then((response) => {
			const groupData = [
				{
					key: 'header',
					title: 'Header',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'hero',
					title: 'Hero',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'content',
					title: 'Content',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'features',
					title: 'Features',
					desc: 'List out features as text, or add icons and images to make them look great!',
				},
				{
					key: 'stats',
					title: 'Stats',
					desc: 'Flaunt those numbers, be it actuisitions, latest metrics, or any statistics!',
				},
				// {
				// 	key: 'steps',
				// 	title: 'Steps',
				// 	desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				// },
				{
					key: 'pricing',
					title: 'Pricing',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'testimonial',
					title: 'Testimonials',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'faq',
					title: 'FAQs',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'team',
					title: 'Team',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'logos',
					title: 'Logos',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'cta',
					title: 'CTA',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				// {
				// 	key: 'newsletter',
				// 	title: 'Newsletter',
				// 	desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				// },
				{
					key: 'footer',
					title: 'Footer',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
			]
			const groupMap = response.data
			for (let i = 0; i < groupData.length; i++) {
				const grp = groupData[i]
				const sortedMods = _.sortBy(
					groupMap[grp.key],
					(o) => o.config.length
				)
				grp.modules = sortedMods
				grp.count = groupMap[grp.key].length
			}
			commit('SET_GROUPS', groupData)
		})
	},

	async getGroupsAuth({ commit, state }, payload) {
		return await ApiService.getGroupsAuth(payload).then((response) => {
			const groupData = [
				{
					key: 'header',
					title: 'Header',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'hero',
					title: 'Hero',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'content',
					title: 'Content',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'features',
					title: 'Features',
					desc: 'List out features as text, or add icons and images to make them look great!',
				},
				{
					key: 'stats',
					title: 'Stats',
					desc: 'Flaunt those numbers, be it actuisitions, latest metrics, or any statistics!',
				},
				// {
				// 	key: 'steps',
				// 	title: 'Steps',
				// 	desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				// },
				{
					key: 'pricing',
					title: 'Pricing',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'testimonial',
					title: 'Testimonials',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'faq',
					title: 'FAQs',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'team',
					title: 'Team',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'logos',
					title: 'Logos',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				{
					key: 'cta',
					title: 'CTA',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
				// {
				// 	key: 'newsletter',
				// 	title: 'Newsletter',
				// 	desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				// },
				{
					key: 'footer',
					title: 'Footer',
					desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
				},
			]
			const groupMap = response.data
			for (let i = 0; i < groupData.length; i++) {
				const grp = groupData[i]
				const sortedMods = _.sortBy(
					groupMap[grp.key],
					(o) => o.config.length
				)
				grp.modules = sortedMods
				grp.count = groupMap[grp.key].length
			}
			commit('SET_GROUPS', groupData)
		})
	},

	async getModules({ commit, state }, payload) {
		return await this.$axios.$get(`/api/modules/index`).then((response) => {
			// eslint-disable-next-line prefer-const
			let modules = []
			_.forEach(response.data, function (mod) {
				modules = modules.concat(mod.variants)
			})
			commit('SET_MODULES', modules)
		})
	},
	async getModulesPublic({ commit }, payload) {
		return await this.$axios
			.$get(`/api/modules/lib/${payload}`)
			.then((response) => {
				// eslint-disable-next-line no-console
				// console.log(response)
				commit('SET_MODULES', response)
			})
	},
	async getModule({ commit }, payload) {
		return await this.$axios
			.$get(`/api/modules/${payload}`)
			.then((response) => {
				const module = response
				module.context.module = module.handle
				commit('SET_MODULE', module)
			})
	},

	async setModule({ commit }, payload) {
		await commit('SET_MODULE', payload)
	},

	async setFullpage({ commit }, payload) {
		await commit('SET_FULLPAGE', payload)
	},

	async updateHTML({ commit }, payload) {
		await commit('UPDATE_HTML', payload)
	},

	async getModulesbyGroup({ commit }, payload) {
		return await this.$axios
			.$get(`/api/modules/group/${payload}`)
			.then((response) => {
				commit('SET_MODULES', response)
			})
	},
	async updateModule({ commit, state }, payload, evt) {
		// await console.log(state.module, 'aaf', payload)
		const mod = _.cloneDeep(state.module)
		mod.context.style = Object.assign(mod.context.style, payload)
		const reqData = {
			meta: { apimode: 'component' },
			content: [mod.context],
		}
		const html = await this.$axios
			.$post(`/api/modules/${mod.handle}/gethtml`, reqData)
			.then((response) => {
				// console.log(response)
				return response.html
				// await commit('SET_HTMLSTR', response.html)
				// await commit('SET_PREVIEW', response.preview)
			})
		mod.htmlstr = html
		await commit('UPDATE_MODULE', mod)
	},

	async updateModuleContext({ commit, state }, payload) {
		// await commit('UPDATE_MODCONTENT', payload)
		await console.log(state.module, 'aaf', payload)
		const mod = _.cloneDeep(state.module)
		mod.context = Object.assign(mod.context, payload)
		const reqData = {
			meta: { apimode: 'component' },
			content: [mod.context],
		}
		const html = await this.$axios
			.$post(`/api/modules/${mod.handle}/gethtml`, reqData)
			.then((response) => {
				// console.log(response)
				return response.html
				// await commit('SET_HTMLSTR', response.html)
				// await commit('SET_PREVIEW', response.preview)
			})
		mod.htmlstr = html
		await commit('UPDATE_MODULE', mod)
	},
	async updateFullpage({ commit }, payload) {
		await commit('UPDATE_FULLPAGE', payload)
	},
	async updateVariant({ commit }, payload) {
		await commit('SET_VARIANT', payload)
	},
	async getHTML({ commit }, payload) {
		return await this.$axios
			.$post(`/api/modules/${payload.handle}/gethtml`, payload.reqData)
			.then(async (response) => {
				// console.log(response)
				await commit('SET_HTMLSTR', response.html)
				await commit('SET_PREVIEW', response.preview)
				return response.html
			})
	},
	async getPageHTML({ commit }, payload) {
		return await this.$axios
			.$post(`/api/modules/getpage`, payload)
			.then(async (response) => {
				// console.log(response)
				await commit('SET_PAGEHTML', response.html)
			})
	},
}

export const getters = {
	modulesByTag: (state) => (tag) => {
		const modules = state.groups.reduce(
			(acc, curr) => [...acc, ...curr.modules],
			[]
		)
		return modules.filter((m) => {
			if (!m.tags) {
				return false
			}
			if (!Array.isArray(m.tags)) {
				return m.tags === tag
			}
			return m.tags.includes(tag)
		})
	},
	modulesHandleMap: (state) => {
		const modules = state.groups.reduce(
			(acc, curr) => [...acc, ...curr.modules],
			[]
		)
		return modules.reduce(
			(acc, curr) => ({ ...acc, [curr.handle]: curr }),
			{}
		)
	},
}
