<template>
	<div>
		<p class="uk-text-meta uk-margin-small-bottom">Container</p>
		<div class="uk-flex uk-flex-wrap cgroup">
			<button
				v-for="item in containerOptions"
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
				<i class="icon text">{{ item }} </i>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Container',
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
			containerOptions: ['xs', 'sm', 'md', 'lg', 'xl', 'ex'],
		}
	},
	methods: {
		handleClick(item) {
			this.$emit('updateModule', { [this.attr]: item })
		},
	},
}
</script>
