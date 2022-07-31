<template>
	<div class="" style="border-bottom: 1px solid #e1e1e1; padding-top: 25px">
		<div class="uk-flex uk-flex-between uk-flex-middle">
			<h4 :id="'item' + itemindex + 1" class="uk-margin-remove-bottom">
				Item {{ itemindex + 1 }}
			</h4>
			<div>
				<button
					type="button"
					class="uk-text-small uk-text-danger"
					data-uk-close
					@click="removeItem"
				>
					<span class="uk-display-inline-block">Remove &nbsp;</span>
				</button>
			</div>
		</div>
		<ValidationObserver v-slot="{}">
			<div
				v-if="fields.includes('itemSubtitle')"
				class="uk-margin uk-margin-top"
			>
				<label class="uk-form-label" :for="'subtitle' + itemindex"
					>Item Subtitle</label
				>
				<div class="uk-form-controls">
					<input
						:id="'subtitle' + itemindex"
						v-model="subtitle"
						class="uk-input"
						type="text"
						placeholder=""
					/>
				</div>
			</div>
			<div v-if="fields.includes('itemTitle')" class="uk-margin">
				<label class="uk-form-label" :for="'title' + itemindex"
					>Item Title</label
				>
				<div class="uk-form-controls">
					<input
						:id="'title' + itemindex"
						v-model="title"
						class="uk-input"
						type="text"
						placeholder=""
					/>
				</div>
			</div>
			<div v-if="fields.includes('itemDescription')" class="uk-margin">
				<label class="uk-form-label" :for="'description' + itemindex"
					>Item Description</label
				>
				<div class="uk-form-controls">
					<textarea
						:id="'description' + itemindex"
						v-model="description"
						class="uk-textarea"
						rows="5"
						placeholder="Add Description"
					></textarea>
				</div>
			</div>
			<div v-if="fields.includes('itemIcon')" class="uk-margin">
				<label class="uk-form-label" :for="'icon' + itemindex"
					>Item Icon (SVG)</label
				>
				<div class="uk-form-controls">
					<textarea
						:id="'icon' + itemindex"
						v-model="icon"
						class="uk-textarea"
						rows="8"
						placeholder="Add Icon"
					></textarea>
					<span class="uk-text-muted uk-text-small"
						>Get SVG's from
						<a target="_blank" href="https://heroicons.com/"
							>Heroicons</a
						>
					</span>
				</div>
			</div>
			<div v-if="fields.includes('itemImage') && image" class="uk-margin">
				<!-- <Image /> -->
				<MediaImage
					:ctx="image"
					:item="false"
					:idx="'item' + itemindex"
					@updateModuleCtxImg="updateModuleCtxImg"
				/>
			</div>
			<div v-if="fields.includes('itemCtas')">
				<div
					v-for="(cta, index) in ctas"
					:key="'itmcta' + index"
					class="uk-margin-medium-bottom uk-margin-medium-top"
				>
					<div
						class="
							uk-flex
							uk-flex-between
							uk-flex-middle
							uk-margin-small-bottom
						"
					>
						<h5 class="uk-margin-remove-bottom uk-text-bold">
							Item Button {{ index + 1 }}
						</h5>
						<div>
							<button
								type="button"
								class="uk-text-small uk-text-danger"
								data-uk-close
								@click="removeItemCta(index)"
							>
								<span class="uk-display-inline-block"
									>Remove &nbsp;</span
								>
							</button>
						</div>
					</div>
					<Cta
						:ctx="cta"
						:cindex="index"
						:itindex="itemindex"
						@updateModuleCtxCta="updateModuleCtxCta"
					/>
				</div>

				<a
					class="
						uk-button
						uk-button-small
						uk-button-primary
						uk-margin-top
						uk-display-inline-block
						uk-margin-medium-bottom
					"
					:href="'#addItemCta' + itemindex"
					uk-toggle
					>Add CTA</a
				>
			</div>
		</ValidationObserver>
		<div
			:id="'addItemCta' + itemindex"
			class="additemcta-modal"
			data-uk-modal
		>
			<div class="uk-modal-dialog">
				<!-- <form action="" @submit.prevent="addItemCta"> -->
				<ValidationObserver v-slot="{ invalid }">
					<button
						class="uk-modal-close-default"
						type="button"
						uk-close
					></button>
					<div class="uk-modal-header">
						<h4 class="uk-text-bold">
							Add CTA to Item {{ itemindex + 1 }}
						</h4>
					</div>
					<div class="uk-modal-body">
						<div class="uk-grid uk-margin">
							<div class="uk-width-1-2@m">
								<div class="uk-margin">
									<ValidationProvider
										v-slot="{ errors }"
										name="Label"
										rules="req"
									>
										<label
											class="uk-form-label"
											:for="'ctalabel' + itemindex"
											>Label</label
										>
										<div class="uk-form-controls">
											<input
												:id="'ctalabel' + itemindex"
												v-model="newCta.label"
												class="uk-input"
												type="text"
												placeholder=""
											/>
										</div>
										<span
											class="
												uk-text-danger
												uk-text-small
												uk-display-block
											"
											>{{ errors[0] }}</span
										>
									</ValidationProvider>
								</div>
							</div>
							<div class="uk-width-1-2@m">
								<div class="uk-margin">
									<label class="uk-form-label" for="ctattype"
										>Type</label
									>
									<div class="uk-form-controls">
										<select
											:id="'ctattype' + itemindex"
											v-model="newCta.type"
											class="uk-select"
										>
											<option value="primary">
												Primary
											</option>
											<option value="secondary">
												Secondary
											</option>
											<option value="default">
												Default
											</option>
											<option value="link">Link</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div class="uk-margin">
								<ValidationProvider
									v-slot="{ errors }"
									name="Url"
									rules="req|url|nospace"
								>
									<label
										class="uk-form-label"
										:for="'ctaurl' + itemindex"
										>URL</label
									>
									<div class="uk-form-controls">
										<input
											:id="'ctaurl' + itemindex"
											v-model="newCta.url"
											class="uk-input"
											type="text"
											placeholder=""
										/>
									</div>
									<span
										class="
											uk-text-danger
											uk-text-small
											uk-display-block
										"
										>{{ errors[0] }}</span
									>
								</ValidationProvider>
							</div>
						</div>
						<div class="uk-grid uk-margin">
							<div class="uk-width-1-2@m">
								<div class="uk-margin">
									<label
										class="uk-form-label"
										:for="'itemsize' + itemindex"
										>Size</label
									>
									<div class="uk-form-controls">
										<select
											:id="'itemsize' + itemindex"
											v-model="newCta.size"
											class="uk-select"
										>
											<option value="sm">Small</option>
											<option value="md">Medium</option>
											<option value="lg">Large</option>
										</select>
									</div>
								</div>
							</div>
							<div class="uk-width-1-2@m">
								<div class="uk-margin" style="margin-top: 35px">
									<label
										><input
											v-model="newCta.external"
											class="uk-checkbox"
											type="checkbox"
											name="external"
										/>
										&nbsp;External</label
									>
								</div>
							</div>
						</div>
					</div>
					<div class="uk-modal-footer uk-text-right">
						<button
							class="uk-button uk-button-default uk-modal-close"
							type="reset"
						>
							Cancel
						</button>
						<button
							class="uk-button uk-button-primary uk-modal-close"
							type="button"
							:disabled="invalid"
							@click="addItemCta"
						>
							Save
						</button>
					</div>
				</ValidationObserver>
				<!-- </form> -->
			</div>
		</div>
	</div>
</template>

<script>
import Cta from '@/components/config/Cta'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import MediaImage from '@/components/config/MediaImage'
const _ = require('lodash')

export default {
	name: 'Item',
	components: {
		ValidationProvider,
		ValidationObserver,
		MediaImage,
		Cta,
	},
	props: {
		ctx: {
			type: Object,
			required: true,
		},
		itemindex: {
			type: Number,
			required: true,
		},
		fields: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			newCta: {
				label: '',
				type: 'primary',
				url: '',
				size: 'md',
			},
		}
	},
	computed: {
		title: {
			get() {
				return this.ctx.title
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const item = _.clone(this.ctx)
					item.title = value
					this.$emit('updateModuleCtxItem', item, this.itemindex)
				}, 1000)
			},
		},
		subtitle: {
			get() {
				return this.ctx.subtitle
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const item = _.clone(this.ctx)
					item.subtitle = value
					this.$emit('updateModuleCtxItem', item, this.itemindex)
				}, 1000)
			},
		},
		description: {
			get() {
				return this.ctx.description
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					const item = _.clone(this.ctx)
					item.description = value
					this.$emit('updateModuleCtxItem', item, this.itemindex)
				}, 1000)
			},
		},
		icon: {
			get() {
				return this.ctx.icon
			},
			set(value) {
				const item = _.clone(this.ctx)
				item.icon = value
				this.$emit('updateModuleCtxItem', item, this.itemindex)
			},
		},
		image() {
			return this.ctx.image
		},

		ctas() {
			return this.ctx.ctas || []
		},
	},
	methods: {
		removeItem() {
			this.$emit('removeItem', this.itemindex)
		},
		updateModuleCtxImg(payload, isItem) {
			const item = _.cloneDeep(this.ctx)
			item.image = payload
			this.$emit('updateModuleCtxItem', item, this.itemindex)
		},
		updateModuleCtxCta(payload, index) {
			const item = _.cloneDeep(this.ctx)
			item.ctas[index] = payload
			this.$emit('updateModuleCtxItem', item, this.itemindex)
		},
		addItemCta(e) {
			const item = _.cloneDeep(this.ctx)
			const ctas = item.ctas || []
			ctas.push(this.newCta)
			console.log('innddddddeeexxx', this.itemindex)
			item.ctas = ctas
			this.$emit('updateModuleCtxItem', item, this.itemindex)
			this.$uikit.modal(`#addItemCta${this.itemindex}`).hide()
			this.newCta = {}
		},
		removeItemCta(index) {
			const item = _.cloneDeep(this.ctx)
			item.ctas.splice(index, 1)
			this.$emit('updateModuleCtxItem', item, this.itemindex)
		},
	},
}
</script>
