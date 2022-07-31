<template>
	<div>
		<div uk-sticky="sel-target: #editor-nav; cls-active: uk-navbar-sticky">
			<nav
				id="editor-nav"
				class="uk-navbar uk-padding-small uk-tile-muted"
				uk-navbar
			>
				<div class="uk-navbar-left">
					<div>
						<span class="uk-text-small">
							Theme: {{ theme.name }}
						</span>
						<br />
						<span class="uk-text-meta">
							Last saved
							{{ new Date(theme.updated_at).toDateString() }}
						</span>
					</div>
				</div>

				<div class="uk-navbar-right">
					<nuxt-link :to="`/projects/${$route.params.slug}/themes`">
						<span uk-icon="icon: sign-out; ratio: 2"> </span>
					</nuxt-link>
				</div>
			</nav>
		</div>
		<div class="uk-container uk-margin-bottom">
			<div class="uk-width-1-2@m uk-margin-auto">
				<div
					v-for="(item, index) in themeForms"
					:key="index"
					class="uk-card uk-card-default uk-card-body uk-border-rounded uk-margin-large-top"
				>
					<h3>{{ item.title }}</h3>
					<FormContainer
						:fields="item.fields"
						submit-label="Save"
						:submit-handler="handleThemeSave"
						:loading="loading"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { startCase, toLower } from 'lodash'
import FormContainer from '@/components/form/FormContainer'

export default {
	name: 'Theme',
	components: {
		FormContainer,
	},
	data() {
		return { loading: false }
	},
	async fetch({ store, error, params }) {
		try {
			await store.dispatch('projects/getCurrentProject', params.slug)
			await store.dispatch('themes/getTheme', {
				project: params.slug,
				theme: params.themeid,
			})
		} catch (err) {
			console.log(err)
			error({ statusCode: 500, message: 'Something went wrong' })
		}
	},
	computed: {
		...mapState({
			project: (state) => state.projects.project,
			theme: (state) => state.themes.theme,
			variables: (state) => state.themes.theme.variables,
		}),
		themeForms() {
			return [
				{
					title: 'Background Colors',
					fields: this.getBackgroundFields(),
				},
				{
					title: 'Colors',
					fields: this.getTextColors(),
				},
				{
					title: 'Fonts',
					fields: [
						{
							name: 'global_font_family',
							label: 'Font Family',
							type: 'font',
							defaultValue:
								this.variables.global_font_family || '',
						},
						{
							name: 'global_font_size',
							label: 'Global Font Size (px)',
							type: 'number',
							step: '0.00001',
							halfWidth: true,
							defaultValue: parseFloat(
								this.variables.global_font_size
							),
						},
						{
							name: 'global_line_height',
							label: 'Global Line Height',
							type: 'number',
							step: '0.00001',
							halfWidth: true,
							defaultValue: parseFloat(
								this.variables.global_line_height
							),
						},
						...this.getRemFontSizes(),
					],
				},
				{
					title: 'Breakpoints',
					fields: this.getBreakpoints(),
				},
				{
					title: 'Custom CSS',
					fields: [
						{
							name: 'custom_css',
							label: 'CSS',
							type: 'textarea',
							style: { height: '200px' },
							defaultValue: this.variables.custom_css || '',
						},
					],
				},
			]
		},
	},
	methods: {
		...mapActions({
			saveTheme: 'themes/saveTheme',
		}),
		async handleThemeSave(updatedVariables) {
			try {
				this.loading = true
				Object.entries(updatedVariables).forEach(([name, value]) => {
					if (this.variables[name] && typeof value === 'number') {
						if (this.variables[name].endsWith('px'))
							updatedVariables[name] = `${value}px`
						else if (this.variables[name].endsWith('rem'))
							updatedVariables[name] = `${value}rem`
						else updatedVariables[name] = `${value}`
					}
				})

				const themeData = {
					variables: this.theme.variables
						? {
								...this.theme.variables,
								...updatedVariables,
						  }
						: updatedVariables,
				}
				await this.saveTheme({
					themeData,
					project: this.project.slug,
					theme: this.theme.id,
				})
				this.loading = false
				this.$uikit.notification('Theme saved successfully', 'success')
			} catch (error) {
				this.loading = false
				console.log(error)
				this.$uikit.notification('Something went wrong', 'danger')
			}
		},
		getBackgroundFields() {
			return [
				'global_background',
				'global_muted_background',
				'global_primary_background',
				'global_secondary_background',
				'global_success_background',
				'global_warning_background',
				'global_danger_background',
			].map((bg) => ({
				name: bg,
				label: startCase(toLower(bg)),
				type: 'color',
				halfWidth: true,
				defaultValue: this.variables[bg],
			}))
		},

		getTextColors() {
			return [
				'global_color',
				'global_emphasis_color',
				'global_muted_color',
				'global_link_color',
				'global_link_hover_color',
				'global_inverse_color',
			].map((c) => ({
				name: c,
				label: startCase(toLower(c)),
				type: 'color',
				halfWidth: true,
				defaultValue: this.variables[c],
			}))
		},

		getBreakpoints() {
			return [
				'breakpoint_small',
				'breakpoint_medium',
				'breakpoint_large',
				'breakpoint_xlarge',
			].map((bp) => ({
				name: bp,
				label: `${startCase(toLower(bp))} (px)`,
				type: 'number',
				step: '0.00001',
				defaultValue: parseFloat(this.variables[bp]),
			}))
		},

		getRemFontSizes() {
			return [
				'global_2xlarge_font_size',
				'global_xlarge_font_size',
				'global_large_font_size',
				'global_medium_font_size',
				'global_small_font_size',
			].map((f) => ({
				name: f,
				label: `${startCase(toLower(f))} (rem)`,
				type: 'number',
				step: '0.00001',
				halfWidth: true,
				defaultValue: parseFloat(this.variables[f]),
			}))
		},
	},
}
</script>
