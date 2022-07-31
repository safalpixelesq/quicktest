<template>
	<div>
		<p class="uk-text-meta uk-margin-small-bottom">
			{{ attr === 'justify' ? 'Justify' : 'Item Justify' }}
		</p>
		<div class="uk-flex uk-flex-wrap cgroup">
			<button
				v-for="item in alignOptions"
				:key="item"
				class="
					config-button
					uk-flex uk-flex-middle uk-flex-center uk-margin-small-right
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
	name: 'Justify',
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
			})
		},
	},
}
</script>
