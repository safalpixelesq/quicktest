<template>
	<div>
		<div class="uk-margin-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">
				{{ !item ? 'Background Color' : 'Item Background Color' }}
			</p>
			<div class="uk-flex">
				<div class="uk-flex-none uk-margin-small-right">
					<v-swatches
						v-model.lazy="color"
						shapes="circles"
						popover-x="right"
						:trigger-style="{
							width: '38px',
							height: '38px',
							border: '1px solid var(--pw-tertiary)',
						}"
						:swatches="swatches"
						show-border
						show-fallback
						fallback-input-type="color"
					></v-swatches>
				</div>

				<input
					:value="color"
					title="Choose background color"
					type="text"
					class="config-button text-input"
					@input="onInput"
				/>
			</div>
		</div>
		<div class="uk-margin-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">
				{{ !item ? 'Background Image' : 'Item Background Image' }}
			</p>
			<div class="uk-flex">
				<div class="background-preview uk-margin-small-right">
					<nuxt-img v-if="imgUrl" :src="previewImageUrl()">
					</nuxt-img>
					<span v-else uk-icon="image"> </span>
				</div>
				<div>
					<input
						:value="imgUrl"
						title="Choose background color"
						type="text"
						class="config-button text-input"
						@input="onInput"
					/>
					<button
						class="uk-button uk-button-small uk-margin-top"
						@click="libraryOpen = true"
					>
						Choose from library
					</button>
					<LibraryModal
						:open="libraryOpen"
						:close-handler="() => (libraryOpen = false)"
						:select-handler="updateBackgroundImageURL"
					/>
				</div>
			</div>
		</div>

		<div
			v-if="isImg"
			class="uk-margin"
			style="padding-top: 10px; padding-bottom: 25px"
		>
			<label
				><input
					v-model="invert"
					class="uk-checkbox"
					type="checkbox"
					name="invert"
				/>
				&nbsp;Invert text over background
			</label>
		</div>
	</div>
</template>

<script>
import LibraryModal from '@/components/asset-library/LibraryModal'

export default {
	name: 'Background',
	components: {
		LibraryModal,
	},
	props: {
		config: {
			type: Object,
			required: true,
		},
		item: {
			type: Boolean,
			required: false,
		},
	},
	data() {
		return {
			timeout: null,
			libraryOpen: false,
			swatches: [
				'#F2F2F2',
				'#ECEEFD',
				'#0A174D',
				'#333366',
				'#E03F27',
				'#FFFFFF',
				'#BBDAE0',
				'#F8A9A4',
				'#EDDBCC',
				'#333333',
				'linear-gradient(45deg, rgba(51,51,153,1) 0%, rgba(220,71,62,1) 100%)',
				'#14B888',
			],
		}
	},
	computed: {
		color: {
			get() {
				return this.isCol ? this.config.background : ''
			},
			set(col) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.$emit('updateModule', {
						[`${this.item ? 'itemBackground' : 'background'}`]: col,
					})
				}, 300)
			},
		},
		invert: {
			get() {
				return this.config.invert || false
			},
			set(value) {
				this.$emit('updateModule', {
					[`${this.item ? 'itemInvert' : 'invert'}`]: value,
				})
			},
		},
		isCol() {
			return this.config.background.includes('#')
		},
		isImg() {
			return this.config.background.includes('.')
		},
		imgUrl() {
			return this.isImg ? this.config.background : ''
		},
	},
	methods: {
		onInput(e) {
			this.$emit('updateModule', {
				[`${this.item ? 'itemBackground' : 'background'}`]:
					e.target.value.includes('.') &&
					!e.target.value.includes('url')
						? `url(${e.target.value})`
						: e.target.value,
			})
		},

		updateBackgroundImageURL(asset) {
			this.$emit('updateModule', {
				[`${
					this.item ? 'itemBackground' : 'background'
				}`]: `url(${asset.secure_url})`,
			})
			this.libraryOpen = false
		},
		previewImageUrl() {
			let url = ''
			if (this.isImg) {
				const match = this.config.background.match(/url\('?(.*?)'?\)/i)
				console.log(match)
				url = match[1] || ''
			}

			return url
		},
	},
}
</script>

<style lang="scss" scoped>
.config-button.text-input {
	border: 1px solid #ddd;
	outline: none;
	transition: width ease-in-out 0.5s;
	width: 100%;
	border-radius: 21px;
	border-color: var(--pw-tertiary);
	text-align: left;
	padding-left: 15px;
	padding-right: 15px;
	margin-right: 10px;
	&:hover,
	&:focus {
		outline: none;
	}
}
.background-preview {
	flex: none;
	border: 0.5px solid #ddd;
	width: 20%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	img {
		height: auto;
		width: 100%;
		object-fit: contain;
	}
}
</style>
