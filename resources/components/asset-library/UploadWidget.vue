<template>
	<div>
		<table
			v-if="files.length"
			class="uk-table uk-table-divider uk-table-middle"
		>
			<thead>
				<tr>
					<th></th>
					<th></th>
					<th>File name</th>
					<th>Progress</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(file, index) in files" :key="index">
					<td>
						<button
							v-if="!file.success"
							class="uk-icon-button uk-text-danger"
							uk-icon="trash"
							@click="removeFile(index)"
						></button>
					</td>
					<td>
						<img
							v-if="file.thumb"
							class="td-image-thumb"
							:src="file.thumb"
							width="60"
						/>
					</td>
					<td>
						{{ file.name }}
					</td>
					<td>
						<progress
							id="js-progressbar"
							class="uk-progress"
							:value="file.progress"
							max="100"
						></progress>
					</td>
					<td>
						<span
							v-if="file.error"
							class="uk-text-danger"
							uk-icon="icon: close"
						></span>
						<span
							v-if="file.success"
							class="uk-text-success"
							uk-icon="icon: check"
						></span>
					</td>
				</tr>
			</tbody>
		</table>

		<div
			class="uk-placeholder uk-padding-large uk-flex uk-flex-middle uk-flex-center"
			:class="{
				activeDrop: $refs.upload && $refs.upload.dropActive,
			}"
		>
			<span uk-icon="icon: cloud-upload"></span>
			<span class="uk-text-middle">
				&nbsp; Drop your images here or
			</span>

			<FileUpload
				ref="upload"
				v-model="files"
				:drop="true"
				:size="1024 * 1024 * 10"
				:drop-directory="true"
				:post-action="uploadURL"
				:multiple="true"
				:headers="{
					Authorization: $auth.$storage._state['_token.local'],
				}"
				extensions="gif,jpg,jpeg,png,webp,svg,mp4,pdf"
				accept="image/png,image/gif,image/jpeg,image/jpg,image/webp,image/svg+xml,video/mp4, application/pdf"
				:data="uploadPostData"
				@input-filter="inputFilter"
				@input-file="inputFile"
			>
				<span class="uk-text-primary select-link"> select one </span>
			</FileUpload>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		folder: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			files: [],
		}
	},
	computed: {
		uploadURL() {
			return `${process.env.API_URL}/api/asset-library/upload`
		},
		uploadPostData() {
			return {
				folder: this.folder,
			}
		},
	},
	methods: {
		inputFilter(newFile, oldFile) {
			if (
				newFile &&
				newFile.error === '' &&
				newFile.file &&
				(!oldFile || newFile.file !== oldFile.file)
			) {
				newFile.blob = ''
				const URL = window.URL || window.webkitURL
				if (URL) {
					newFile.blob = URL.createObjectURL(newFile.file)
				}

				newFile.thumb = ''
				if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
					newFile.thumb = newFile.blob
				}
			}
		},
		inputFile(newFile) {
			if (newFile) {
				this.$refs.upload.active = true
			}
		},
		removeFile(index) {
			this.files.splice(index, 1)
		},
	},
}
</script>

<style lang="scss" scoped>
.activeDrop {
	border-color: var(--pw-primary);
}
.select-link {
	margin-left: 8px;
	text-decoration: underline !important;
}
</style>
