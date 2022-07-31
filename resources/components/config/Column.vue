<template>
	<div class="">
		<div class="uk-margin-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">Columns</p>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="item in colOptions"
					:key="item"
					title="Move Media to left"
					class="
						config-button
						uk-flex
						uk-flex-middle
						uk-flex-center
						uk-margin-small-right
						uk-margin-small-bottom
					"
					:class="[config.columns === item ? 'is-active' : '']"
					@click="handleClick('columns', item)"
				>
					<i class="icon text"> {{ item }} </i>
				</button>
			</div>
		</div>
		<div>
			<p class="uk-text-meta uk-margin-small-bottom">Column Gap</p>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="item in colGapOptions"
					:key="item"
					class="
						config-button
						uk-flex
						uk-flex-middle
						uk-flex-center
						uk-margin-small-right
						uk-margin-small-bottom
					"
					:class="[config.columnGap === item ? 'is-active' : '']"
					@click=";[handleClick('columnGap', item)]"
				>
					<i class="icon text">{{ item }} </i>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Column',
	props: {
		config: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			colOptions: [1, 2, 3, 4, 5],
			colGapOptions: ['sm', 'md', 'lg', 'no'],
		}
	},
	methods: {
		handleClick(key, val) {
			this.$emit('updateModule', { [key]: val })
		},
	},
}
</script>
