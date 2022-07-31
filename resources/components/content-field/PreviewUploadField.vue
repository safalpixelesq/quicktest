<template>
	<div class="uk-margin-small-right image-preview">
		<nuxt-img v-if="value" :src="value" />
		<span v-else uk-icon="image"> </span>
		<div class="add-replace-image">
			<button @click="libraryOpen = true">
				{{ value ? 'Replace ' : 'Add ' }} Media
			</button>
		</div>
		<LibraryModal
			:open="libraryOpen"
			:close-handler="() => (libraryOpen = false)"
			:select-handler="updateImageURL"
		/>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import LibraryModal from '@/components/asset-library/LibraryModal'
export default {
	name: 'PreviewUploadField',
	components: { LibraryModal },
	props: {
		fieldContext: {
			type: String,
			required: true,
		},
		fieldName: {
			type: String,
			required: true,
		},
		parentPath: {
			type: String,
			required: true,
		},
		useParentPath: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return { libraryOpen: false }
	},
	computed: {
		path() {
			return this.useParentPath
				? this.parentPath
				: `${this.parentPath}['${this.fieldName}']`
		},
		value: {
			get() {
				return this.fieldContext
			},
			set(value) {
				this.updateSectionByPath({
					path: this.path,
					value,
				})
			},
		},
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
		}),
		updateImageURL(asset) {
			this.value = asset.secure_url
			this.libraryOpen = false
		},
	},
}
</script>
<style lang="scss" scoped>
.image-preview {
	position: relative;
	flex: none;
	border: 0.5px solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;

	img {
		height: auto;
		width: 100%;
		object-fit: contain;
	}

	.add-replace-image {
		display: none;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		outline: none;
		background-color: rgba(255, 89, 89, 0.2);
		button {
			cursor: pointer;
			border-radius: 14px;
			background-color: #fff;
			border: 0.5px solid #000;
		}
	}

	&:hover .add-replace-image {
		display: flex;
	}
}
</style>
