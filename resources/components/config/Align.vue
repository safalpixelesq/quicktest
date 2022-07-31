<template>
	<div>
		<p class="uk-text-meta uk-margin-small-bottom">
			{{ attr === 'align' ? 'Text Align' : 'Item Text Align' }}
		</p>
		<div class="uk-flex uk-flex-wrap cgroup">
			<button
				v-for="item in alignOptions"
				:key="item"
				class="
					config-button
					uk-flex
					uk-flex-middle
					uk-flex-center
					uk-margin-small-right
					uk-margin-small-bottom
				"
				:class="[config === item ? 'is-active' : '']"
				@click=";[handleClick(item)]"
			>
				<i class="icon material-icons"> format_align_{{ item }} </i>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Align',
	props: {
		config: {
			type: String,
			required: true,
		},
		attr: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			alignOptions: ['left', 'center', 'right'],
		}
	},
	methods: {
		handleClick(item) {
			this.$emit('updateModule', {
				[this.attr]: item,
				[this.attr === 'align' ? 'justify' : 'itemJustify']: item,
			})
			// this.$emit('updateModule', 'justify', item)
		},
	},
}
</script>
