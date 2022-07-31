<template>
	<div>
		<div
			v-if="!hasGlobalHeader"
			class="uk-tile uk-tile-muted uk-padding-small"
		>
			<div class="uk-flex uk-flex-between uk-flex-middle">
				<h5 class="uk-margin-remove-bottom">
					Please create your site's default header
				</h5>
				<button
					class="uk-button uk-button-small uk-button-text"
					@click="pushCreatePartial('globalHeader')"
				>
					Create header
				</button>
			</div>
		</div>
		<draggable
			v-model="fullpage"
			:group="{
				name: 'page',
				pull: false,
				sort: false,
			}"
			class="drop-zone"
			ghost-class="base"
			drag-class="levitate"
			handle=".eachmod"
		>
			<div
				v-for="(element, index) in fullpage"
				:id="`${element.uid}-section-${index}`"
				:key="`${element.uid}-section-${index}`"
			>
				<div
					v-if="element.htmlstr"
					class="eachmod uk-position-relative pqc"
				>
					<div
						:class="`${assetFolder} theme override`"
						v-html="element.htmlstr"
					></div>
					<div class="customize">
						<div v-if="!element.isPartial" class="uk-flex">
							<button
								class="config-button uk-margin-small-right"
								title="Swap to a new module"
								@click="onModuleSwap(index, 'left')"
							>
								<span uk-icon="arrow-left"></span>
							</button>
							<button
								class="config-button uk-margin-small-right"
								title="Swap to a new module"
								@click="onModuleSwap(index, 'right')"
							>
								<span uk-icon="arrow-right"></span>
							</button>
							<button
								v-if="element.rootModule"
								title="Reset to original module"
								class="config-button uk-margin-small-right"
								@click="resetModuleSwap(index)"
							>
								<span uk-icon="history"></span>
							</button>
							<button
								class="config-button uk-margin-small-right"
								title="Edit this module"
								@click="onModuleEdit(index, 'content')"
							>
								<span uk-icon="settings"></span>
							</button>
							<button
								class="config-button uk-margin-small-right"
								title="Edit this module"
								@click="onModuleEdit(index)"
							>
								<span uk-icon="paint-bucket"></span>
							</button>
							<button
								class="config-button uk-margin-small-right"
								title="Duplicate this module"
								@click="onModuleDuplicate(index)"
							>
								<span uk-icon="copy"></span>
							</button>
						</div>

						<button
							v-else
							class="
								uk-button
								uk-button-secondary
								uk-button-small
								uk-margin-small-right
							"
							title="Edit this partial in the partial editor"
							@click="editPartial(element.partialID)"
						>
							Edit partial
						</button>
						<button
							class="config-button uk-text-danger"
							title="Delete this module"
							@click="onModuleDelete(index)"
						>
							<span uk-icon="trash"></span>
						</button>
					</div>
				</div>
				<div v-if="element.isDragHint" class="drop-placeholder">
					<span
						class="uk-text-tertiary"
						uk-icon="icon: thumbnails; ratio: 4"
					></span>
					<div class="uk-width-medium uk-text-medium">
						Drag and Drop the modules you like here, from the menu
						on left.
					</div>
				</div>
			</div>
		</draggable>
		<div
			v-if="!hasGlobalFooter"
			class="uk-tile uk-tile-muted uk-padding-small"
		>
			<div class="uk-flex uk-flex-between uk-flex-middle">
				<h5 class="uk-margin-remove-bottom">
					Please create your site's default footer
				</h5>
				<button
					class="uk-button uk-button-small uk-button-text"
					@click="pushCreatePartial('globalFooter')"
				>
					Create footer
				</button>
			</div>
		</div>

		<vue-modal
			name="config-modal"
			draggable=".config-modal-top-bar"
			:adaptive="true"
			:height="500"
			:width="400"
		>
			<div>
				<div class="uk-flex uk-flex-between config-modal-top-bar">
					<span uk-icon="icon: grid; ratio:1.2"></span>

					<span
						uk-icon="icon: close"
						style="cursor: pointer"
						@click="$modal.hide('config-modal')"
					></span>
				</div>

				<Configurator
					v-if="activeSection"
					:config="activeSection.config"
					:styleobj="activeSection.context.style"
					:collection="activeSection.context.items || []"
					:update-item-style="updateItemStyle"
					@updateModule="updateSectionStyle"
				/>
			</div>
		</vue-modal>

		<vue-modal
			name="editor-modal"
			draggable=".editor-modal-top-bar"
			:adaptive="true"
			:height="580"
			:width="500"
		>
			<div>
				<div class="uk-flex uk-flex-between editor-modal-top-bar">
					<span uk-icon="icon: grid; ratio:1.2"></span>

					<span
						uk-icon="icon: close"
						style="cursor: pointer"
						@click="$modal.hide('editor-modal')"
					></span>
				</div>

				<EditorV2 v-if="activeSection"></EditorV2>
			</div>
		</vue-modal>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import EditorV2 from '@/components/builder/EditorV2'

import Configurator from '@/components/builder/Configurator'

export default {
	name: 'EditorWindow',
	components: {
		EditorV2,
		Configurator,
	},
	props: {
		hasGlobalHeader: {
			type: Boolean,
			default: true,
		},
		hasGlobalFooter: {
			type: Boolean,
			default: true,
		},
		handleSave: {
			type: Function,
			default: () => {},
		},
	},
	computed: {
		...mapState({
			groups: (state) => state.modules.groups,
			project: (state) => state.projects.project,
			sections: (state) => state.editors.sections,
			isDirty: (state) => state.editors.isDirty,
			activeSectionIndex: (state) => state.editors.activeSectionIndex,
		}),
		...mapGetters({
			assetFolder: 'projects/assetFolder',
			globalHeader: 'partials/globalHeader',
			globalFooter: 'partials/globalFooter',
			modulesByTag: 'modules/modulesByTag',
			saveReadySections: 'editors/saveReadySections',
		}),
		activeSection() {
			return this.activeSectionIndex > -1
				? this.sections[this.activeSectionIndex]
				: null
		},
		fullpage: {
			get() {
				return this.sections
			},
			async set(value) {
				this.setEditorDirty(true)
				const filteredSections = []
				for (let i = 0; i < value.length; i++) {
					const mod = value[i]
					if (mod) {
						if (!mod.isDragHint && !mod.isPartial && !mod.htmlstr) {
							const reqData = {
								meta: { apimode: 'component' },
								content: [mod.context],
							}
							mod.htmlstr = await this.getHTML({
								handle: mod.handle,
								reqData,
							})
						}

						if (!mod.isDragHint) {
							filteredSections.push(mod)
						}
					}
				}

				this.setSections(filteredSections)
			},
		},
	},

	mounted() {
		if (window.addEventListener) {
			// remove any old listner
			window.removeEventListener('click', this.linkClickDisabler)
			// add new listner
			window.addEventListener('click', this.linkClickDisabler)
		}
	},

	beforeDestroy() {
		if (window.addEventListener) {
			// remove listner
			window.removeEventListener('click', this.linkClickDisabler)
		}
	},

	methods: {
		...mapActions({
			getHTML: 'modules/getHTML',
			setEditorDirty: 'editors/setEditorDirty',
			setSections: 'editors/setSections',
			updateSection: 'editors/updateSection',
			deleteSection: 'editors/deleteSection',
			duplicateSection: 'editors/duplicateSection',
			setActiveSectionIndex: 'editors/setActiveSectionIndex',
			updateSectionContext: 'editors/updateSectionContext',
			createPartial: 'partials/createPartial',
		}),

		updateSectionStyle(update) {
			this.updateSectionContext({
				updateIndex: this.activeSectionIndex,
				handle: this.activeSection.handle,
				context: {
					...this.activeSection.context,
					style: { ...this.activeSection.context.style, ...update },
				},
			})
		},
		updateItemStyle(update, itemIndex) {
			const itemsCopy = [...this.activeSection.context.items]
			itemsCopy.splice(itemIndex, 1, {
				...itemsCopy[itemIndex],
				style: {
					...itemsCopy[itemIndex].style,
					...update,
				},
			})

			this.updateSectionContext({
				updateIndex: this.activeSectionIndex,
				handle: this.activeSection.handle,
				context: {
					...this.activeSection.context,
					items: itemsCopy,
				},
			})
		},
		updateSectionContent(update) {
			this.updateSectionContext({
				updateIndex: this.activeSectionIndex,
				handle: this.activeSection.handle,
				context: {
					...this.activeSection.context,
					...update,
				},
			})
		},
		onModuleEdit(index, editorType) {
			this.setActiveSectionIndex(index)
			if (editorType === 'content') {
				this.$modal.show('editor-modal')
			} else {
				this.$modal.show('config-modal')
			}
		},
		async onModuleSwap(index, direction) {
			const currentModule = this.sections[index]
			console.log(currentModule)
			const group = this.groups.find((g) => {
				if (currentModule.rootModule) {
					return currentModule.rootModule.group === g.key
				}
				return currentModule.group === g.key
			})

			const modules = group.modules.filter((m) => {
				if (currentModule.context.items) {
					return m.context.items
				}
				return !m.context.items
			})
			const activeModIndex = modules.findIndex(
				(m) => m.uid === this.sections[index].uid
			)
			let swapIndex =
				direction === 'left'
					? activeModIndex - 1
					: direction === 'right'
					? activeModIndex + 1
					: activeModIndex

			if (swapIndex < 0) {
				swapIndex = modules.length - 1
			}
			if (swapIndex >= modules.length) {
				swapIndex = 0
			}

			const swapModule = modules[swapIndex]
			const mergedContext = this.mergeContext(
				swapModule.context,
				currentModule.rootModule
					? currentModule.rootModule.context
					: currentModule.context
			)

			const merger = {
				...swapModule,
				context: {
					...mergedContext,
				},
				rootModule: currentModule.rootModule
					? currentModule.rootModule
					: currentModule,
			}

			merger.htmlstr = await this.getHTML({
				handle: swapModule.handle,
				reqData: {
					meta: { apimode: 'component' },
					content: [merger.context],
				},
			})
			this.updateSection({
				updateIndex: index,
				update: merger,
			})
		},
		resetModuleSwap(index) {
			const currentModule = this.sections[index]
			if (currentModule.rootModule) {
				this.updateSection({
					updateIndex: index,
					update: {
						...currentModule.rootModule,
						rootModule: null,
					},
				})
			}
		},
		mergeContext(toContext, fromContext) {
			const mergedContext = {}
			for (const key in toContext) {
				if (key === 'items') {
					mergedContext[key] = fromContext[key].map((item) =>
						this.mergeContext(toContext[key][0], item)
					)
				} else if (key === 'style') {
					mergedContext[key] = {
						...toContext[key],
						...(fromContext[key].background && {
							background: fromContext[key].background,
						}),
					}
				} else if (key === 'module') {
					mergedContext[key] = toContext[key]
				} else {
					mergedContext[key] = fromContext[key]
						? fromContext[key]
						: toContext[key]
				}
			}
			return mergedContext
		},
		pushCreatePartial(name) {
			if (!this.isDirty) {
				this.$router.push(
					`/projects/${this.project.slug}/partials/${this[name].uuid}/edit`
				)
			} else {
				this.$uikit.modal
					.confirm(
						'Your current changes will automatically be saved.'
					)
					.then(() => {
						this.setEditorDirty(false)
						return this.handleSave(this.saveReadySections)
					})
					.then(() => {
						this.$router.push(
							`/projects/${this.project.slug}/partials/${this[name].uuid}/edit`
						)
					})
			}
		},
		editPartial(partialID) {
			if (!this.isDirty) {
				this.$router.push(
					`/projects/${this.project.slug}/partials/${partialID}/edit`
				)
			} else {
				this.$uikit.modal
					.confirm(
						'Your current changes will automatically be saved.'
					)
					.then(() => {
						this.setEditorDirty(false)
						return this.handleSave(this.saveReadySections)
					})
					.then(() => {
						this.$router.push(
							`/projects/${this.project.slug}/partials/${partialID}/edit`
						)
					})
			}
		},
		onModuleDelete(index) {
			this.deleteSection(index)
		},
		onModuleDuplicate(index) {
			this.duplicateSection(index)
		},
		linkClickDisabler(e) {
			if (e.target && e.target.closest('a')) {
				e.preventDefault()
			}
		},
	},
}
</script>

<style lang="scss">
.drop-zone {
	min-height: 100vh;
	.base {
		box-shadow: inset 2px 2px 20px -10px #000;
		background-color: rgba(11, 246, 255, 0.7);
		cursor: grabbing !important;
		& * {
			opacity: 0 !important;
		}
	}

	.levitate {
		background-color: rgba(11, 246, 255, 0.4);
		border: 2px solid rgb(11, 246, 255);
		& * {
			opacity: 0 !important;
		}
	}

	.eachmod {
		.customize {
			position: absolute;
			background-color: rgba(255, 255, 255, 0);
			right: 0;
			top: 0;
			padding: 10px;
			display: none;
			z-index: 100;
			align-items: center;

			.config-button {
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
			}
		}

		&:hover {
			border: 2px solid rgb(11, 246, 255);
			cursor: grab;
			.customize {
				display: flex;
			}
		}
	}

	.drop-placeholder {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
}
.config-modal-top-bar,
.editor-modal-top-bar {
	background: rgb(243, 243, 243);
	border-bottom: 0.5px solid #ddd;
	padding: 10px;
	cursor: grab;
}
</style>
