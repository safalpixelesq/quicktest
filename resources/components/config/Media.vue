<template>
	<div>
		<div
			v-if="config.mediaPos"
			class="uk-margin-medium-right uk-margin-bottom"
		>
			<p class="uk-text-meta uk-margin-small-bottom">Media position</p>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="(item, index) in posOptions"
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
					:class="[config.mediaPos === item ? 'is-active' : '']"
					@click="handleClick('pos', item)"
				>
					<i
						class="material-icons"
						:style="
							'transform: rotate(' +
							(index ? '270' : '90') +
							'deg)'
						"
					>
						get_app
					</i>
				</button>
			</div>
		</div>
		<div v-if="config.mediaWidth">
			<div class="uk-text-meta uk-margin-small-bottom">Media width</div>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="item in mediaWidthOptions"
					:key="item"
					class="
						config-button
						uk-flex
						uk-flex-middle
						uk-flex-center
						uk-margin-small-right
						uk-margin-small-bottom
					"
					:class="[config.mediaWidth === item ? 'is-active' : '']"
					@click=";[handleClick('width', item)]"
				>
					<i class="icon text">{{ item }} </i>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Media',
	props: {
		config: {
			type: Object,
			required: true,
		},
		attr: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			posOptions: ['left', 'right'],
			currWidthIndex: 4,
			mediaWidthOptions: [
				// '1/5',
				'1/4',
				'1/3',
				'2/5',
				'1/2',
				'3/5',
				'2/3',
				'3/4',
				// '4/5',
			],
		}
	},
	methods: {
		handleClick(key, val) {
			this.$emit('updateModule', { [this.attr[key]]: val })
		},
	},
}
</script>
