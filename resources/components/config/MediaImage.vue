<template>
	<div>
		<LibraryModal
			:open="libraryOpen"
			:close-handler="() => (libraryOpen = false)"
			:select-handler="updateImageURL"
		/>
		<div class="uk-margin">
			<label class="uk-form-label" :for="'imgurl' + idx">Image URL</label>
			<button
				class="
					uk-button
					uk-button-small
					uk-button-text
					uk-margin-small-bottom
				"
				@click="libraryOpen = true"
			>
				( Replace from library )
			</button>

			<div class="uk-form-controls">
				<input
					:id="'imgurl' + idx"
					v-model="url"
					class="uk-input"
					type="text"
					placeholder=""
				/>
			</div>
		</div>
		<div class="uk-grid uk-margin uk-grid-small">
			<div class="uk-width-1-2@m">
				<div class="">
					<label class="uk-form-label uk-display-block"
						>Preview</label
					>
					<img v-if="url" :src="url" :alt="alt" />
					<div
						v-if="!url"
						class="
							uk-placeholder
							uk-text-center
							uk-text-bold
							uk-margin-remove-vertical
						"
						style="padding: 49px 30px"
					>
						Add Image
					</div>
				</div>
			</div>
			<div class="uk-width-1-2@m">
				<div class="uk-margin">
					<label class="uk-form-label" :for="'imagalt' + idx"
						>Alt Text</label
					>
					<div class="uk-form-controls">
						<input
							:id="'imagalt' + idx"
							v-model="alt"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" :for="'imgcap' + idx"
						>Caption</label
					>
					<div class="uk-form-controls">
						<input
							:id="'imgcap' + idx"
							v-model="caption"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import LibraryModal from '@/components/asset-library/LibraryModal'
const _ = require('lodash')

export default {
	name: 'MediaImage',
	components: {
		LibraryModal,
	},
	props: {
		ctx: {
			type: Object,
			required: true,
		},
		item: {
			type: Boolean,
			required: false,
		},
		idx: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			libraryOpen: false,
		}
	},
	computed: {
		...mapState({
			project: (state) => state.projects.project,
			selectedAssetURL: (state) => state.asset_library.selectedAssetURL,
			assetReferrer: (state) => state.asset_library.referrer,
		}),

		url: {
			get() {
				return this.ctx.url
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.url = value
					this.$emit('updateModuleCtxImg', image, this.item)
				}, 1000)
			},
		},
		alt: {
			get() {
				return this.ctx.alt
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.alt = value
					this.$emit('updateModuleCtxImg', image, this.item)
				}, 1000)
			},
		},
		caption: {
			get() {
				return this.ctx.caption
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const image = _.clone(this.ctx)
					image.caption = value
					this.$emit('updateModuleCtxImg', image, this.item)
				}, 1000)
			},
		},
	},
	watch: {
		selectedAssetURL(url) {
			if (this.assetReferrer === 'replace_image_item' && url) {
				this.url = url
			}
		},
	},
	methods: {
		updateImageURL(asset) {
			this.url = asset.secure_url
			this.libraryOpen = false
		},
	},
}
</script>
