import axios from 'axios'
import cookies from 'js-cookie'

const token = cookies.get('auth._token.local') || 'not'
const apiClient = axios.create({
	baseURL: process.env.API_URL || 'https://api.uiaas.io',
	// baseURL: 'https://staging.uiaas.io',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		Authorization: token,
	},
})

export default {
	getModulesPublic(slug) {
		return apiClient.get(`/api/modules/lib/${slug}`)
	},

	getGroups(lib) {
		return apiClient.get(`/api/groups/lib/${lib}`)
	},

	getGroupsAuth(lib) {
		return apiClient.get(`/api/groupsauth/lib/${lib}`)
	},
	// getFragments(slug) {
	// 	return apiClient.get(`/api/project/${slug}/modules`)
	// },
	// getFragment(payload) {
	// 	return apiClient.get(
	// 		`/api/project/${payload.slug}/modules/${payload.handle}`
	// 	)
	// },
	getModules() {
		return apiClient.get(`/api/modules/index`)
	},
	getModule(payload) {
		return apiClient.get(`/api/modules/${payload}`)
	},
	getProjects() {
		return apiClient.get('/api/project/index')
	},
	getProject(slug) {
		return apiClient.get(`/api/project/index/${slug}`)
	},
	createProject(payload) {
		return apiClient.post('/api/project/create', payload)
	},
	editProject(payload) {
		return apiClient.patch(`/api/project/update/${payload.id}`, payload)
	},
	// getHTML(payload) {
	// 	return apiClient.post(
	// 		`/api/project/${payload.pSlug}/modules/gethtml`,
	// 		payload
	// 	)
	// },
	getHTML(payload) {
		return apiClient.post(
			`/api/modules/${payload.handle}/gethtml`,
			payload.reqData
		)
	},
	generateToken() {
		return apiClient.get(`/api/auth/generate-token`)
	},
	hasToken(payload) {
		return apiClient.get(`/api/auth/tokens`, payload)
	},
	revokeToken(payload) {
		return apiClient.get(`/api/auth/revoke-token`, payload)
	},
}
