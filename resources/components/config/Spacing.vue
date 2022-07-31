<template>
	<div>
		<p class="uk-text-meta uk-margin-small-bottom">Vertical Padding</p>
		<div class="uk-flex uk-flex-wrap cgroup">
			<button
				v-for="item in spacingOpts"
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
			<!-- <button
				class="config-button uk-margin-small-right"
				title="Decrease vertical spacing"
				@click="
					;[
						(currIndex = currIndex > 0 ? currIndex - 1 : 0),
						handleClick(vPaddingOpts[currIndex]),
					]
				"
			>
				<i class="material-icons"> unfold_less </i>
			</button>
			<button
				title="Increase vertical spacing"
				class="config-button uk-flex uk-flex-middle uk-flex-center"
				@click="
					;[
						(currIndex = currIndex < 6 ? currIndex + 1 : 6),
						handleClick(vPaddingOpts[currIndex]),
					]
				"
			>
				<i class="material-icons"> unfold_more </i>
			</button> -->
		</div>
	</div>
</template>

<script>
export default {
	name: 'Spacing',
	props: {
		config: {
			type: [String, Number],
			required: true,
		},
		attr: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			currIndex: 2,
			spacingOpts: ['xs', 'sm', 'md', 'lg', 'xl', 'no'],
		}
	},
	methods: {
		handleClick(item) {
			this.$emit('updateModule', { [this.attr]: item })
		},
	},
}
</script>
