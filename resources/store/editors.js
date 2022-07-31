import { set, get, cloneDeep, merge } from 'lodash'
import ApiService from '~/services/ApiService.js'
export const state = () => ({
	isDirty: false,
	activeSectionIndex: '',
	sections: [],
})

export const mutations = {
	SET_IS_DIRTY(state, isDirty) {
		state.isDirty = isDirty
	},

	SET_ACTIVE_SECTION_INDEX(state, sectionIndex) {
		state.activeSectionIndex = sectionIndex
	},

	SET_SECTIONS(state, sections) {
		state.sections = sections
	},

	UPDATE_SECTION(state, payload) {
		if (payload.updateIndex > -1) {
			state.sections.splice(payload.updateIndex, 1, {
				...state.sections[payload.updateIndex],
				...payload.update,
			})
		}
	},

	DUPLICATE_SECTION(state, duplicateIndex) {
		if (duplicateIndex > -1) {
			state.sections.splice(duplicateIndex + 1, 0, {
				...state.sections[duplicateIndex],
			})
		}
	},

	DELETE_SECTION(state, deleteIndex) {
		if (deleteIndex > -1) {
			state.sections.splice(deleteIndex, 1)
		}
	},

	UPDATED_SECTION_BY_PATH(state, update) {
		if (update.deleteArrayValue) {
			const obj = get(
				state.sections[state.activeSectionIndex],
				update.path
			)
			obj.splice(update.value, 1)
		} else if (update.duplicateArrayValue) {
			const clonedValue = cloneDeep(
				get(
					state.sections[state.activeSectionIndex],
					`${update.path}[${update.value}]`
				)
			)
			const obj = get(
				state.sections[state.activeSectionIndex],
				update.path
			)
			obj.splice(update.value + 1, 0, clonedValue)
		} else {
			const obj = cloneDeep(state.sections[state.activeSectionIndex])
			set(obj, update.path, update.value)
			state.sections.splice(state.activeSectionIndex, 1, obj)
		}
	},

	UPDATED_SECTION_HTML(state, html) {
		state.sections[state.activeSectionIndex].htmlstr = html
	},

	SET_CONNECTOR(state, fields) {
		state.connector = fields
	},
	SET_CONNECTION(state, payload) {
		const activeSection = state.sections[state.activeSectionIndex]
		if (payload.overwrite) {
			activeSection.connection = payload.paths
		} else {
			activeSection.connection = activeSection.connection
				? merge(activeSection.connection, payload.paths)
				: payload.paths
		}
	},
	REMOVE_CONNECTION(state, path) {
		delete state.sections[state.activeSectionIndex].connection[path]
	},
}

export const actions = {
	setEditorDirty({ commit }, dirty) {
		commit('SET_IS_DIRTY', dirty)
	},

	setActiveSectionIndex({ commit }, payload) {
		commit('SET_ACTIVE_SECTION_INDEX', payload)
	},

	setSections({ commit }, payload) {
		commit('SET_SECTIONS', payload)
	},

	updateSection({ commit }, payload) {
		commit('SET_IS_DIRTY', true)
		commit('UPDATE_SECTION', payload)
	},

	duplicateSection({ commit }, payload) {
		commit('SET_IS_DIRTY', true)
		commit('DUPLICATE_SECTION', payload)
	},

	deleteSection({ commit }, payload) {
		commit('SET_IS_DIRTY', true)
		commit('DELETE_SECTION', payload)
	},

	async updateSectionByPath({ commit, state }, update) {
		commit('UPDATED_SECTION_BY_PATH', update)
		const activeSection = cloneDeep(
			state.sections[state.activeSectionIndex]
		)

		if (update.fulfillConnection && activeSection.connection) {
			for (const path in activeSection.connection) {
				const connectionValue = activeSection.connection[path]
				if (typeof connectionValue === 'object') {
					const newItems = []
					const defaultContent = get(activeSection, path)
					const connectorData = Array.isArray(
						state.connector[connectionValue.path]
					)
						? state.connector[connectionValue.path]
						: [state.connector[connectionValue.path]]
					for (const i in connectorData) {
						newItems[i] = cloneDeep(defaultContent[0])
						for (const subPath in connectionValue.connection) {
							set(
								newItems[i],
								subPath,
								get(
									connectorData,
									`[${i}]${connectionValue.connection[subPath]}`
								)
							)
						}
					}
					set(activeSection, path, newItems)
				}
			}

			commit('UPDATE_SECTION', {
				updateIndex: state.activeSectionIndex,
				update: activeSection,
			})
		}

		const { data } = await ApiService.getHTML({
			handle: activeSection.handle,
			reqData: {
				meta: { apimode: 'component' },
				content: [activeSection.context],
			},
		})
		if (data.html) {
			commit('UPDATED_SECTION_HTML', data.html)
		} else {
			console.log('HTML render failed', data)
		}
	},

	updateSectionContext({ commit }, payload) {
		commit('SET_IS_DIRTY', true)
		ApiService.getHTML({
			handle: payload.handle,
			reqData: {
				meta: { apimode: 'component' },
				content: [payload.context],
			},
		})
			.then(({ data }) => {
				commit('UPDATE_SECTION', {
					updateIndex: payload.updateIndex,
					update: {
						context: payload.context,
						htmlstr: data.html,
					},
				})
			})
			.catch((error) => {
				console.log(error)
			})
	},

	resetEditor({ commit }) {
		commit('SET_IS_DIRTY', false)
		commit('SET_SECTIONS', [])
		commit('SET_ACTIVE_SECTION_INDEX', '')
	},

	setConnector({ commit }, fields) {
		commit('SET_CONNECTOR', fields)
	},

	setConnection({ commit }, paths) {
		commit('SET_CONNECTION', {
			paths,
			overwrite: false,
		})
	},

	setConnectionOverwrite({ commit }, paths) {
		commit('SET_CONNECTION', {
			paths,
			overwrite: true,
		})
	},

	removeConnection({ commit }, path) {
		commit('REMOVE_CONNECTION', path)
	},
}

export const getters = {
	saveReadySections(state) {
		return state.sections
			.map((section) => {
				if (section.isDragHint) {
					return null
				}
				if (section.isPartial) {
					return {
						isPartial: true,
						partialID: section.partialID,
					}
				}

				// cleanup fractal default fields
				if (section.context) {
					delete section.context._config
					delete section.context._env
					delete section.context._self
				}

				return {
					context: section.context,
					htmlstr: section.htmlstr,
					connection: section.connection,
				}
			})
			.filter((m) => !!m)
	},
	sectionConnection(state) {
		return (
			state.sections[state.activeSectionIndex] &&
			state.sections[state.activeSectionIndex].connection
		)
	},
}
