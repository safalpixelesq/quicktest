<template>
	<div uk-sticky="sel-target: #editor-nav; cls-active: uk-navbar-sticky">
		<nav id="editor-nav" class="uk-navbar-container uk-flex" uk-navbar>
			<div class="uk-navbar-left">
				<div
					class="add-module-icon"
					uk-toggle="target: #offcanvas-module-nav"
				>
					<span uk-icon="icon: thumbnails; ratio: 2"> </span>
				</div>

				<slot></slot>
				<button
					class="uk-margin-left uk-button uk-button-text"
					@click="libraryOpen = true"
				>
					Asset Library
				</button>
				<button class="uk-margin-left uk-button uk-button-text">
					Help
				</button>

				<LibraryModal
					:open="libraryOpen"
					:close-handler="() => (libraryOpen = false)"
				/>
			</div>

			<div class="uk-navbar-right">
				<div class="uk-padding-small">
					<button
						class="uk-button uk-button-text uk-margin-small-right"
						@click="onSave(0)"
					>
						Save
					</button>
					<button
						v-if="hasPublish"
						class="uk-button uk-button-secondary uk-button-small"
						@click="onSave(1)"
					>
						Publish
					</button>
				</div>
				<div
					class="exit-icon uk-flex uk-flex-center uk-flex-middle"
					@click="exitEditor"
				>
					<span uk-icon="icon: sign-out; ratio: 2"> </span>
				</div>
			</div>
		</nav>
		<div id="offcanvas-module-nav" class="uk-offcanvas" uk-offcanvas>
			<div class="uk-offcanvas-bar">
				<ModuleMenu :groups="moduleMenu" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ModuleMenu from '@/components/builder/ModuleMenu'
import LibraryModal from '@/components/asset-library/LibraryModal'

export default {
	name: 'EditorHeader',
	components: {
		ModuleMenu,
		LibraryModal,
	},
	props: {
		showPartials: {
			type: Boolean,
			default: false,
		},
		hasPublish: {
			type: Boolean,
			default: false,
		},
		handleSave: {
			type: Function,
			default: () => {},
		},
		exitLink: {
			type: String,
			default: '#',
		},
	},
	data() {
		return {
			libraryOpen: false,
		}
	},
	computed: {
		...mapState({
			groups: (state) => state.modules.groups,
			partials: (state) => state.partials.partials,
			project: (state) => state.projects.project,
			sections: (state) => state.editors.sections,
			isDirty: (state) => state.editors.isDirty,
		}),
		...mapGetters({
			partialsAsModuleMenu: 'partials/partialsAsModuleMenu',
			saveReadySections: 'editors/saveReadySections',
		}),
		moduleMenu() {
			if (this.showPartials) {
				return [...this.groups, this.partialsAsModuleMenu]
			}
			return this.groups
		},
	},

	methods: {
		...mapActions({
			resetEditor: 'editors/resetEditor',
			setEditorDirty: 'editors/setEditorDirty',
		}),
		onSave(publish) {
			this.handleSave(this.saveReadySections, publish)
			this.setEditorDirty(false)
			if (publish) {
				this.$router.push(this.exitLink)
			}
		},
		exitEditor() {
			if (!this.isDirty) {
				this.resetEditor()

				this.$router.go(-1) || this.$router.push(this.exitLink)
			} else {
				this.$uikit.modal
					.confirm('Your have unsaved changes.', {
						labels: { ok: 'Save & Exit', cancel: 'Exit' },
					})
					.then(() => {
						this.onSave()
						this.resetEditor()
						this.$router.go(-1) || this.$router.push(this.exitLink)
					})
					.catch((e) => {
						this.resetEditor()
						this.$router.go(-1) || this.$router.push(this.exitLink)
					})
			}
		},
	},
}
</script>
<style lang="scss" scoped>
#editor-nav {
	background-color: #fff;
	border-bottom: 1px solid var(--pw-tertiary);

	.add-module-icon {
		position: relative;
		height: 100%;
		padding: 0 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		background-color: var(--pw-primary);
	}

	.exit-icon {
		height: 100%;
		border-left: 1px solid var(--pw-tertiary);
		padding: 0 20px;
		color: var(--text-tertiary);
	}
}

#offcanvas-module-nav .uk-offcanvas-bar {
	width: 550px !important;
	box-shadow: 1px 1px 50px -20px #000 !important;
}
</style>
