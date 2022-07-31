import { uniqBy } from 'lodash'

export const state = () => ({
	open: false,
	assets: {},
})

export const mutations = {
	SET_LIBRARY_OPEN(state, open) {
		state.open = open
	},
	SET_LIBRARY_ASSETS(state, assets) {
		state.assets = { ...state.assets, ...assets }
	},
	SET_LOADING(state, payload) {
		if (!state.assets[payload.assetFolder]) {
			state.assets[payload.assetFolder] = {}
		}

		state.assets = {
			...state.assets,
			[payload.assetFolder]: {
				...state.assets[payload.assetFolder],
				loading: payload.loading,
			},
		}
	},
}

export const actions = {
	setLibraryOpen({ commit }, isOpen) {
		commit('SET_LIBRARY_OPEN', isOpen)
	},

	async fetchAssets({ commit, state }, assetData) {
		try {
			commit('SET_LOADING', {
				assetFolder: assetData.assetFolder,
				loading: true,
			})
			const { data: responseData } = await this.$axios.get(
				`/api/asset-library/list?folder=${assetData.assetFolder}&file=${
					assetData.file || ''
				}&next_cursor=${assetData.next_cursor || ''}	
				`
			)
			const newResources =
				!assetData.file && state.assets[assetData.assetFolder].resources
					? [
							...state.assets[assetData.assetFolder].resources,
							...responseData.data.resources,
					  ]
					: responseData.data.resources
			commit('SET_LIBRARY_ASSETS', {
				[assetData.assetFolder]: {
					...responseData.data,
					...{
						resources: uniqBy(newResources, function (asset) {
							return asset.asset_id
						}),
					},
				},
			})
		} catch (error) {
			console.log(error)
			commit('SET_LOADING', {
				assetFolder: assetData.assetFolder,
				loading: false,
			})
		}
	},
}
