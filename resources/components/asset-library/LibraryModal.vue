<template>
	<Modal
		:open="open"
		:close-handler="closeHandler"
		:content-style="{ width: '75%' }"
	>
		<div class="uk-modal-header uk-flex uk-flex-between uk-flex-middle">
			<h3 class="uk-modal-title uk-margin-remove-bottom">
				Asset Library
			</h3>
			<div>
				<button
					v-if="searchView"
					class="uk-button uk-button-text uk-margin-right"
					@click="clearSearch"
				>
					Clear search
				</button>
				<input
					v-model="search"
					class="uk-input search-input"
					type="text"
					placeholder="Search"
				/>
				<button
					class="uk-button uk-button-primary uk-margin-right"
					@click="searchAssets"
				>
					Search
				</button>
			</div>
		</div>
		<div class="uk-modal-body">
			<UploadWidget v-if="uploadView" :folder="assetFolder" />
			<div v-else uk-overflow-auto>
				<div class="uk-grid">
					<div class="uk-width-1-5">
						<div class="upload-icon-box" @click="uploadView = true">
							<span uk-icon="icon: cloud-upload; ratio: 3"></span>
							<h4 class="uk-margin-remove-top">Upload</h4>
						</div>
					</div>
					<div v-if="isLoading" class="uk-width-1-5">
						<div class="loading-icon-box">
							<div class="loading-bar">
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
					</div>
					<div
						v-for="(asset, index) in projectAssets.slice(
							page * perPage - perPage,
							page * perPage
						)"
						:key="index"
						class="uk-width-1-5"
						@click="selectHandler && (selected = asset)"
					>
						<div
							class="uk-position-relative uk-padding uk-overflow-hidden image-preview-box"
							:uk-tooltip="`title: ${asset.filename}.${asset.format};  pos: bottom`"
							:class="{
								active: isSelected(asset),
							}"
						>
							<embed
								v-if="asset.format === 'pdf'"
								width="100%"
								:src="asset.secure_url"
							/>
							<nuxt-img
								v-else
								:src="asset.secure_url"
								alt=""
								style="max-height: 100%"
							/>

							<span
								v-if="isSelected(asset)"
								class="check uk-position-top-right"
								uk-icon="check"
							></span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="uk-modal-footer uk-text-right uk-flex uk-flex-between">
			<div>
				<span class="uk-margin-right">
					Showing {{ page * perPage - 12 }} -
					{{
						page * perPage > paginationData.total_count
							? paginationData.total_count
							: page * perPage
					}}
					of
					{{ paginationData.total_count }}
				</span>
				<button
					class="uk-button uk-button-default uk-button-small"
					:disabled="page <= 1"
					@click="previousPage"
				>
					Previous
				</button>
				<button
					class="uk-button uk-button-default uk-button-small"
					:disabled="page * perPage >= paginationData.total_count"
					@click="nextPage"
				>
					Next
				</button>
			</div>
			<div>
				<button
					v-if="uploadView"
					class="uk-button uk-button-default"
					type="button"
					@click="resetLibrary"
				>
					Back to library
				</button>
				<div v-else>
					<button
						class="uk-button uk-button-default"
						type="button"
						@click.prevent="closeHandler"
					>
						Close
					</button>

					<button
						v-if="selectHandler"
						class="uk-button uk-button-primary uk-modal-close"
						type="button"
						:disabled="!selected"
						@click="onSelect"
					>
						Select
					</button>
				</div>
			</div>
		</div>
	</Modal>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Modal from '@/components/Modal'
import UploadWidget from '@/components/asset-library/UploadWidget'

export default {
	name: 'LibraryModal',
	components: {
		Modal,
		UploadWidget,
	},
	props: {
		open: {
			type: Boolean,
			required: true,
		},
		closeHandler: {
			type: Function,
			required: true,
		},
		selectHandler: {
			type: Function,
			default: null,
		},
	},
	data() {
		return {
			selected: null,
			uploadView: false,
			search: '',
			page: 1,
			perPage: 13,
			searchView: false,
		}
	},
	computed: {
		...mapState({
			assets: (state) => state.asset_library.assets,
		}),
		...mapGetters({
			assetFolder: 'projects/assetFolder',
		}),
		projectAssets() {
			return (
				(this.assets[this.assetFolder] &&
					this.assets[this.assetFolder].resources) ||
				[]
			)
		},
		isLoading() {
			return (
				(this.assets[this.assetFolder] &&
					this.assets[this.assetFolder].loading) ||
				false
			)
		},
		paginationData() {
			return (
				(this.assets[this.assetFolder] && {
					next_cursor: this.assets[this.assetFolder].next_cursor,
					total_count: this.assets[this.assetFolder].total_count,
				}) ||
				{}
			)
		},
	},
	watch: {
		open(isOpen) {
			if (isOpen) {
				this.fetchAssets({ assetFolder: this.assetFolder })
			}
		},
	},
	methods: {
		...mapActions({
			fetchAssets: 'asset_library/fetchAssets',
			setLibraryOpen: 'asset_library/setLibraryOpen',
		}),
		isSelected(asset) {
			return this.selected && asset.asset_id === this.selected.asset_id
		},
		handleUploadBack() {
			this.fetchLibrary()
			this.uploadView = false
		},
		resetLibrary() {
			this.uploadView = false
			this.fetchAssets({ assetFolder: this.assetFolder })
		},
		onSelect() {
			this.selectHandler(this.selected)
		},
		nextPage() {
			this.page += 1
			if (
				this.projectAssets.length - 1 <
				this.page * this.perPage - this.perPage
			) {
				this.fetchAssets({
					assetFolder: this.assetFolder,
					next_cursor: this.paginationData.next_cursor,
				})
			}
		},
		previousPage() {
			this.page -= 1
		},
		searchAssets() {
			this.searchView = true
			this.fetchAssets({
				assetFolder: this.assetFolder,
				file: this.search,
			})
		},
		clearSearch() {
			this.searchView = false
			this.search = ''
			this.fetchAssets({
				assetFolder: this.assetFolder,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.upload-icon-box {
	flex-direction: column;
	border: 2px dashed var(--pw-primary);
}

.image-preview-box,
.loading-icon-box {
	border: 2px solid #ddd;
	&.active {
		border: 2px solid #32d296;
	}

	& .check {
		color: #32d296;
		border: 2px solid #32d296;
		padding: 8px;
		margin: 8px;
		border-radius: 50%;
	}
}

.upload-icon-box,
.image-preview-box,
.loading-icon-box {
	margin-top: 20px;
	margin-bottom: 20px !important;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	height: 200px;
	border-radius: 8px;
	&:hover {
		background-color: var(--pw-lightbg);
	}
}

.uk-modal-body {
	height: 60vh !important;
	overflow-y: auto;
}

.loading-bar {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
}
.loading-bar div {
	display: inline-block;
	position: absolute;
	left: 8px;
	width: 16px;
	background: #ddd;
	animation: loading-bar 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.loading-bar div:nth-child(1) {
	left: 8px;
	animation-delay: -0.24s;
}
.loading-bar div:nth-child(2) {
	left: 32px;
	animation-delay: -0.12s;
}
.loading-bar div:nth-child(3) {
	left: 56px;
	animation-delay: 0;
}

@keyframes loading-bar {
	0% {
		top: 8px;
		height: 64px;
	}
	50%,
	100% {
		top: 24px;
		height: 32px;
	}
}

.search-input {
	width: 300px;
}
</style>
