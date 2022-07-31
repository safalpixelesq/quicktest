<template>
	<div class="uk-position-relative">
		<div v-if="config.items">
			<ul
				class="uk-tab uk-margin-remove-bottom"
				uk-scrollspy-nav="closest: li; scroll: true; offset:20"
			>
				<li
					v-if="
						fields.includes('title') ||
						fields.includes('logo') ||
						fields.includes('description') ||
						fields.includes('ctas')
					"
				>
					<a href="#main">Main</a>
				</li>
				<li
					v-for="(item, index) in config.items"
					:key="'item' + index + 1"
				>
					<a :href="'#item' + index + 1"
						>{{ index === 0 ? 'Item' : '' }} {{ index + 1 }}</a
					>
				</li>
				<!-- <li>
					<a class="uk-text-right" href="#addItem" uk-toggle
						><span uk-icon="icon: plus; ratio: .7"></span> Add
						Item</a
					>
				</li> -->
			</ul>
		</div>
		<div
			class="uk-panel-scrollable uk-padding-remove well"
			uk-height-viewport="offset-top:true; offset-bottom: 50px"
		>
			<div
				v-if="
					fields.includes('title') ||
					fields.includes('logo') ||
					fields.includes('description') ||
					fields.includes('ctas')
				"
				id="main"
				style="border-bottom: 1px solid #e1e1e1; padding-top: 25px"
			>
				<div v-if="fields.includes('logo')" class="uk-margin">
					<LogoImage
						:ctx="logo"
						:item="false"
						idx="default"
						@updateModuleCtxLogo="updateModuleCtxLogo"
					/>
				</div>
				<div v-if="fields.includes('subtitle')" class="uk-margin">
					<label class="uk-form-label" for="subtitle">Subtitle</label>
					<div class="uk-form-controls">
						<input
							id="subtitle"
							v-model="subtitle"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
				<div v-if="fields.includes('title')" class="uk-margin">
					<label class="uk-form-label" for="title">Title</label>
					<div class="uk-form-controls">
						<input
							id="title"
							v-model="title"
							class="uk-input"
							type="text"
							placeholder=""
						/>
					</div>
				</div>
				<div v-if="fields.includes('description')" class="uk-margin">
					<label class="uk-form-label" for="description"
						>Description</label
					>
					<div class="uk-form-controls">
						<textarea
							id="description"
							v-model="description"
							class="uk-textarea"
							rows="5"
							placeholder="Add Description"
						></textarea>
					</div>
				</div>
				<div v-if="fields.includes('image')" class="uk-margin">
					<MediaImage
						:ctx="image"
						:item="false"
						idx="default"
						@updateModuleCtxImg="updateModuleCtxImg"
					/>
				</div>
				<div v-if="fields.includes('ctas')">
					<div
						v-for="(cta, index) in ctas"
						:key="'mcta' + index"
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
							<h5
								:id="'cta' + index + 1"
								class="uk-margin-remove-bottom uk-text-bold"
							>
								Button {{ index + 1 }}
							</h5>
							<div>
								<button
									type="button"
									class="uk-text-small uk-text-danger"
									data-uk-close
									@click="removeCta(index)"
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
							@updateModuleCtxCta="updateModuleCtxCta"
						/>
					</div>

					<a
						class="
							uk-button
							uk-button-small
							uk-button-primary
							uk-margin-small-bottom
							uk-display-inline-block
							uk-margin-medium-bottom
						"
						href="#addCTA"
						uk-toggle
						>Add CTA</a
					>
				</div>
				<div v-if="fields.includes('primary')">
					<div
						v-for="(cta, index) in primary"
						:key="'mcta' + index"
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
							<h5
								:id="'cta' + index + 1"
								class="uk-margin-remove-bottom uk-text-bold"
							>
								Primary Link {{ index + 1 }}
							</h5>
							<div>
								<button
									type="button"
									class="uk-text-small uk-text-danger"
									data-uk-close
									@click="removeLink('primary', index)"
								>
									<span class="uk-display-inline-block"
										>Remove &nbsp;</span
									>
								</button>
							</div>
						</div>
						<Navlink
							:ctx="cta"
							:cindex="index"
							mode="primary"
							:parent="true"
							:itindex="'primary' + index"
							@updateModuleCtxLink="updateModuleCtxLink"
						/>
					</div>

					<button
						class="
							uk-button
							uk-button-small
							uk-button-primary
							uk-margin-small-bottom
							uk-display-inline-block
							uk-margin-medium-bottom
						"
						@click="openNavlink('primary')"
					>
						Add Primary
					</button>
				</div>

				<div v-if="fields.includes('secondary')">
					<div
						v-for="(cta, index) in secondary"
						:key="'mcta' + index"
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
							<h5
								:id="'cta' + index + 1"
								class="uk-margin-remove-bottom uk-text-bold"
							>
								Secondary Link {{ index + 1 }}
							</h5>
							<div>
								<button
									type="button"
									class="uk-text-small uk-text-danger"
									data-uk-close
									@click="removeLink('secondary', index)"
								>
									<span class="uk-display-inline-block"
										>Remove &nbsp;</span
									>
								</button>
							</div>
						</div>
						<Navlink
							:ctx="cta"
							:cindex="index"
							mode="secondary"
							:parent="true"
							:itindex="'secondary' + index"
							@updateModuleCtxLink="updateModuleCtxLink"
						/>
					</div>

					<button
						class="
							uk-button
							uk-button-small
							uk-button-primary
							uk-margin-small-bottom
							uk-display-inline-block
							uk-margin-medium-bottom
						"
						@click="openNavlink('secondary')"
					>
						Add Secondary
					</button>
				</div>

				<div v-if="fields.includes('social')">
					<div
						v-for="(cta, index) in social"
						:key="'mcta' + index"
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
							<h5
								:id="'cta' + index + 1"
								class="uk-margin-remove-bottom uk-text-bold"
							>
								Social Link {{ index + 1 }}
							</h5>
							<div>
								<button
									type="button"
									class="uk-text-small uk-text-danger"
									data-uk-close
									@click="removeLink('social', index)"
								>
									<span class="uk-display-inline-block"
										>Remove &nbsp;</span
									>
								</button>
							</div>
						</div>
						<Navlink
							:ctx="cta"
							:cindex="index"
							mode="social"
							:parent="true"
							:itindex="'social' + index"
							@updateModuleCtxLink="updateModuleCtxLink"
						/>
					</div>

					<button
						class="
							uk-button
							uk-button-small
							uk-button-primary
							uk-margin-small-bottom
							uk-display-inline-block
							uk-margin-medium-bottom
						"
						@click="openNavlink('social')"
					>
						Add Social
					</button>
				</div>
			</div>
			<div id="items">
				<div v-if="config.items" class="">
					<div v-for="(item, index) in items" :key="'mitem' + index">
						<!-- <div class="uk-text-right">
							<button
								type="button"
								class=""
								data-uk-close
								@click="removeItem(index)"
							></button>
						</div> -->
						<Item
							:ctx="item"
							:itemindex="index"
							:fields="fields"
							@updateModuleCtxItem="updateModuleCtxItem"
							@removeItem="removeItem"
						/>
					</div>
					<div
						class="uk-margin-bottom"
						style="
							border-bottom: 1px solid #e1e1e1;
							padding-top: 25px;
						"
					>
						<a
							class="
								uk-button
								uk-button-small
								uk-button-primary
								uk-margin-bottom
								uk-display-inline-block
							"
							href="#addItem"
							uk-toggle
							>Add Item</a
						>
					</div>
				</div>
			</div>
		</div>
		<div id="addNavlink" class="addnavlink-modal" data-uk-modal>
			<div class="uk-modal-dialog">
				<ValidationObserver v-slot="{ invalid }">
					<button
						class="uk-modal-close-default"
						type="button"
						uk-close
					></button>
					<div class="uk-modal-header">
						<h4 class="uk-text-bold">Add Navlink</h4>
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
											for="nctalabel"
											>Label</label
										>
										<div class="uk-form-controls">
											<input
												v-model="newNavlink.label"
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
								<div class="uk-margin" style="margin-top: 35px">
									<label
										><input
											v-model="newNavlink.external"
											class="uk-checkbox"
											type="checkbox"
											name="external"
										/>
										&nbsp;External</label
									>
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
									<label class="uk-form-label" for="ctaurl"
										>URL</label
									>
									<div class="uk-form-controls">
										<input
											v-model="newNavlink.url"
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
					</div>
					<div class="uk-modal-footer uk-text-right">
						<button
							class="uk-button uk-button-default uk-modal-close"
							type="button"
						>
							Cancel
						</button>
						<button
							class="uk-button uk-button-primary uk-modal-close"
							type="button"
							:disabled="invalid"
							@click="addNavlink"
						>
							Save
						</button>
					</div>
				</ValidationObserver>
			</div>
		</div>
		<div id="addCTA" class="addcta-modal" data-uk-modal>
			<div class="uk-modal-dialog">
				<ValidationObserver v-slot="{ invalid }">
					<button
						class="uk-modal-close-default"
						type="button"
						uk-close
					></button>
					<div class="uk-modal-header">
						<h4 class="uk-text-bold">Add CTA</h4>
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
											for="nctalabel"
											>Label</label
										>
										<div class="uk-form-controls">
											<input
												id="nctalabel"
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
											id="ctattype"
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
											<option value="video">Video</option>
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
									rules="req|nospace"
								>
									<label class="uk-form-label" for="ctaurl"
										>URL</label
									>
									<div class="uk-form-controls">
										<input
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
									<label class="uk-form-label" for="size"
										>Size</label
									>
									<div class="uk-form-controls">
										<select
											id="size"
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
							type="button"
						>
							Cancel
						</button>
						<button
							class="uk-button uk-button-primary uk-modal-close"
							type="button"
							:disabled="invalid"
							@click="addCta"
						>
							Save
						</button>
					</div>
				</ValidationObserver>
			</div>
		</div>
		<div id="addItem" class="additem-modal" data-uk-modal="stack: true">
			<div class="uk-modal-dialog">
				<ValidationObserver v-slot="{ invalid }">
					<button
						class="uk-modal-close-default"
						type="button"
						uk-close
					></button>
					<div class="uk-modal-header">
						<h4 class="uk-text-bold">Add Item</h4>
					</div>
					<div class="uk-modal-body">
						<div
							v-if="fields.includes('itemTitle')"
							class="uk-margin"
						>
							<ValidationProvider
								v-slot="{ errors }"
								name="Item title"
								rules="req"
							>
								<label class="uk-form-label" for="itemlabel"
									>Item title</label
								>
								<div class="uk-form-controls">
									<input
										id="itemlabel"
										v-model="newItem.title"
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
						<div
							v-if="fields.includes('itemSubtitle')"
							class="uk-margin"
						>
							<label class="uk-form-label" for="itemsubtitle"
								>Item subtitle</label
							>
							<div class="uk-form-controls">
								<input
									id="itemsubtitle"
									v-model="newItem.subtitle"
									class="uk-input"
									type="text"
									placeholder=""
								/>
							</div>
						</div>
						<div
							v-if="fields.includes('itemDescription')"
							class="uk-margin"
						>
							<label class="uk-form-label" for="itemdesc"
								>Item description</label
							>
							<div class="uk-form-controls">
								<textarea
									id="itemdesc"
									v-model="newItem.description"
									class="uk-textarea"
									rows="5"
									placeholder="Add Description"
								></textarea>
							</div>
						</div>
						<div
							v-if="fields.includes('itemImage')"
							class="uk-margin"
						>
							<label class="uk-form-label" for="imgurl"
								>Image URL</label
							>
							<button
								class="
									uk-button
									uk-button-small
									uk-button-text
									uk-margin-small-bottom
								"
								@click="libraryOpen = true"
							>
								(Add from library)
							</button>

							<div class="uk-form-controls">
								<ValidationProvider
									v-slot="{ errors }"
									name="Image url"
									rules="req|url"
								>
									<input
										id="imgurl"
										v-model="newItem.imageurl"
										class="uk-input"
										type="text"
										placeholder=""
									/>
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
						<div
							v-if="fields.includes('itemImage')"
							class="uk-grid uk-margin uk-grid-small"
						>
							<div class="uk-width-1-2@m">
								<div class="">
									<label
										class="uk-form-label uk-display-block"
										for="imagalt"
										>Preview</label
									>
									<img
										v-if="newItem.imageurl"
										:src="newItem.imageurl"
										:alt="newItem.imagealt"
									/>
									<div
										v-if="!newItem.imageurl"
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

									<LibraryModal
										:open="libraryOpen"
										:close-handler="
											() => (libraryOpen = false)
										"
										:select-handler="updateNewItemImageURL"
									/>
								</div>
							</div>
							<div class="uk-width-1-2@m">
								<div class="uk-margin">
									<ValidationProvider
										v-slot="{ errors }"
										name="Alt"
										rules="req"
									>
										<label
											class="uk-form-label"
											for="imagalt"
											>Alt Text</label
										>
										<div class="uk-form-controls">
											<input
												id="imagalt"
												v-model="newItem.imagealt"
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
								<div class="uk-margin">
									<label class="uk-form-label" for="imagcap"
										>Caption</label
									>
									<div class="uk-form-controls">
										<input
											id="imagcap"
											v-model="newItem.imagecap"
											class="uk-input"
											type="text"
											placeholder=""
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="uk-modal-footer uk-text-right">
						<button
							class="uk-button uk-button-default uk-modal-close"
							type="button"
						>
							Cancel
						</button>
						<button
							class="uk-button uk-button-primary uk-modal-close"
							type="button"
							:disabled="invalid"
							@click="addItem"
						>
							Save
						</button>
					</div>
				</ValidationObserver>
			</div>
		</div>
	</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Item from '@/components/config/Item'
import MediaImage from '@/components/config/MediaImage'
import LogoImage from '@/components/config/LogoImage'
import Cta from '@/components/config/Cta'
import Navlink from '@/components/config/Navlink'
import LibraryModal from '@/components/asset-library/LibraryModal'

const _ = require('lodash')

export default {
	name: 'EditEditor',
	components: {
		ValidationProvider,
		ValidationObserver,
		Cta,
		Navlink,
		MediaImage,
		LogoImage,
		Item,
		LibraryModal,
	},
	props: {
		config: {
			type: Object,
			required: true,
		},
		fields: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			libraryOpen: false,
			debVal: 1000,
			tempObj: {},
			isLoading: false,
			navlinkmode: 'primary',
			newCta: {
				label: '',
				type: 'primary',
				url: '',
				size: 'md',
				external: false,
			},
			newNavlink: {
				label: '',
				url: '',
				external: false,
			},
			newItem: {
				subtitle: '',
				title: '',
				description: '',
				icon: '',
				imageurl: '',
				imagealt: '',
				imagecap: '',
				ctas: [],
			},
		}
	},
	computed: {
		// Each field getters and setters
		title: {
			get() {
				return this.config.title
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.$emit('updateModuleContext', { title: value })
				}, 1000)
			},
		},
		subtitle: {
			get() {
				return this.config.subtitle
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.$emit('updateModuleContext', { subtitle: value })
				}, 1000)
			},
		},
		description: {
			get() {
				return this.config.description
			},
			set(value) {
				if (this.timeout) clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.$emit('updateModuleContext', { description: value })
				}, 1000)
			},
		},
		image() {
			return this.config.image
		},
		logo() {
			return this.config.logo
		},
		ctas() {
			return this.config.ctas || []
		},
		primary() {
			return this.config.primary || []
		},
		secondary() {
			return this.config.secondary || []
		},
		social() {
			return this.config.social || []
		},
		items() {
			return this.config.items
		},
	},

	methods: {
		updateModuleCtxLogo(payload, isItem) {
			const logo = payload
			this.$emit('updateModuleContext', { logo })
		},
		updateModuleCtxImg(payload, isItem) {
			const mediaImage = payload
			this.$emit('updateModuleContext', { image: mediaImage })
		},
		updateModuleCtxCta(payload, index) {
			const ctas = _.cloneDeep(this.ctas)
			ctas[index] = payload
			this.$emit('updateModuleContext', { ctas })
		},
		updateModuleCtxLink(payload, index, mode, parent) {
			let ctas = []
			switch (mode) {
				case 'primary':
					ctas = _.cloneDeep(this.primary)
					break
				case 'secondary':
					ctas = _.cloneDeep(this.secondary)
					break
				case 'social':
					ctas = _.cloneDeep(this.social)
					break
				default:
					break
			}
			// if (mode === 'primary') {
			// 	ctas = _.cloneDeep(this.primary)
			// } else {
			// 	ctas = _.cloneDeep(this.secondary)
			// }

			ctas[index] = payload
			this.$emit('updateModuleContext', { [mode]: ctas })

			// if (parent) {
			// 	let ctas = []
			// 	if (mode === 'primary') {
			// 		ctas = _.cloneDeep(this.primary)
			// 	} else {
			// 		ctas = _.cloneDeep(this.secondary)
			// 	}

			// 	ctas[index] = payload
			// 	this.$emit('updateModuleContext', { [mode]: ctas })
			// } else {
			// 	const pctas = payload
			// 	console.log('pta', pctas)
			// 	// pctas.links[index] = payload
			// 	this.$emit('updateModuleContext', { primary: pctas })
			// }
		},
		openNavlink(mode) {
			this.navlinkmode = mode
			this.$uikit.modal('#addNavlink').show()
		},
		addNavlink() {
			let ctas = []
			switch (this.navlinkmode) {
				case 'primary':
					ctas = _.cloneDeep(this.primary)
					break
				case 'secondary':
					ctas = _.cloneDeep(this.secondary)
					break
				case 'social':
					ctas = _.cloneDeep(this.social)
					break
				default:
					break
			}
			ctas.push(this.newNavlink)
			this.$emit('updateModuleContext', { [this.navlinkmode]: ctas })
			this.newNavlink = {}
			this.$uikit.modal('.addnavlink-modal').hide()
		},
		removeLink(type, index) {
			let ctas = []
			switch (type) {
				case 'primary':
					ctas = _.cloneDeep(this.primary)
					break
				case 'secondary':
					ctas = _.cloneDeep(this.secondary)
					break
				case 'social':
					ctas = _.cloneDeep(this.social)
					break
				default:
					break
			}
			ctas.splice(index, 1)
			this.$emit('updateModuleContext', { [type]: ctas })
		},
		addCta(e) {
			const ctas = _.cloneDeep(this.ctas)
			ctas.push(this.newCta)
			this.$emit('updateModuleContext', { ctas })
			this.newCta = {}
			this.$uikit.modal('.addcta-modal').hide()
		},
		removeCta(index) {
			const ctas = _.cloneDeep(this.ctas)
			ctas.splice(index, 1)
			this.$emit('updateModuleContext', { ctas })
		},

		updateModuleCtxItem(payload, index) {
			const items = _.cloneDeep(this.items)
			items[index] = payload
			this.$emit('updateModuleContext', { items })
		},
		addItem(e) {
			const items = _.cloneDeep(this.items)
			const img = {
				url: this.newItem.imageurl,
				alt: this.newItem.imagealt,
				caption: this.newItem.imagecap,
			}
			this.newItem.image = img
			items.push(this.newItem)
			this.$emit('updateModuleContext', { items })
			this.$uikit.modal('.additem-modal').hide()
			this.newItem = {}
		},
		removeItem(index) {
			const items = _.cloneDeep(this.items)
			items.splice(index, 1)
			this.$emit('updateModuleContext', { items })
		},

		updateNewItemImageURL(asset) {
			this.newItem.imageurl = asset.secure_url
		},
	},
}
</script>
<style lang="scss" scoped>
.uk-input {
	/* background-color: #efefef; */
}
.well {
	// box-shadow: inset 0 5px 12px rgb(0 0 0 / 15%);
	border: 0 solid var(--pw-primary);
	margin-top: 15px;
	// border-radius: 10px;
	// padding: 15px !important;
	// border: 0;
}

.uk-tab a {
	font-size: 1rem;
}

.uk-tab > .uk-active > a {
	background-color: var(--pw-primary);
	color: #fff;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
}
</style>
